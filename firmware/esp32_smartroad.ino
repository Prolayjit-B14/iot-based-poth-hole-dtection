/*
 * =====================================================================================
 * SmartRoad AI - ESP32 Hardware Firmware (Dual Ultrasonic + GPS + ESP-CAM + SMTP Email)
 * IoT Pothole & Road Bump Detection System
 * 
 * Hardware Pinouts:
 * 1. Dual HC-SR04 Ultrasonic Sensors:
 *    - Sensor 1 (Left Track) : Trig: GPIO 5,  Echo: GPIO 18
 *    - Sensor 2 (Right Track): Trig: GPIO 21, Echo: GPIO 22
 * 2. NEO-6M GPS Receiver     : RX: GPIO 16, TX: GPIO 17
 * 3. Active 5V Buzzer        : GPIO 19
 * 4. OV2640 ESP32-CAM Module  : AI-Thinker Camera Pins
 * 5. SMTP Email Alerts       : ESP Mail Client (Sends email on CRITICAL pothole)
 * 
 * Libraries Required (Arduino Library Manager):
 * 1. PubSubClient by Nick O'Leary
 * 2. ArduinoJson by Benoit Blanchon (v6+)
 * 3. TinyGPS++ by Mikal Hart
 * 4. ESP Mail Client by Mobizt (v3+)
 * =====================================================================================
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <TinyGPS++.h>
#include <ArduinoJson.h>
#include <ESP_Mail_Client.h>
#include "esp_camera.h"

// --- WiFi & Network Credentials ---
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASS = "YOUR_WIFI_PASSWORD";

// --- MQTT Broker Configuration ---
const char* MQTT_BROKER   = "broker.emqx.io";
const int   MQTT_PORT     = 1883;
const char* DEVICE_ID     = "ESP32-ROAD-001";

// --- SMTP Email Configuration ---
#define SMTP_HOST "smtp.gmail.com"
#define SMTP_PORT 465 // SSL Port
#define AUTHOR_EMAIL "your_alert_sender@gmail.com"
#define AUTHOR_PASSWORD "your_app_password"
#define RECIPIENT_EMAIL "road_maintenance_admin@city.gov"

// --- Hardware Pin Definitions ---
// Dual Ultrasonic Sensors
#define TRIG_PIN_1  5
#define ECHO_PIN_1  18

#define TRIG_PIN_2  21
#define ECHO_PIN_2  22

// Buzzer & GPS
#define BUZZER_PIN  19
#define GPS_RX_PIN  16
#define GPS_TX_PIN  17

// AI-Thinker ESP32-CAM Pin Configuration
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22

// --- Threshold Parameters (in cm) ---
const float BASELINE_CLEARANCE = 32.4;
const float POTHOLE_THRESHOLD  = 45.0; // Distance > 45cm => Road cavity/pothole
const float BUMP_THRESHOLD     = 20.0; // Distance < 20cm => Bump elevation

// --- Global Objects & Variables ---
WiFiClient espClient;
PubSubClient mqttClient(espClient);
TinyGPSPlus gps;
HardwareSerial gpsSerial(2);

SMTPSession smtp;

unsigned long lastHeartbeat = 0;
const unsigned long HEARTBEAT_INTERVAL = 5000;

// --- Function Prototypes ---
void setupWiFi();
void setupCamera();
void reconnectMQTT();
float readUltrasonic(int trigPin, int echoPin);
void checkRoadConditions(float dist1, float dist2);
void sendSMTPEmail(String hazardType, float dist, double lat, double lng);
void sendHeartbeat(float dist1, float dist2);

void setup() {
  Serial.begin(115200);
  gpsSerial.begin(9600, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);

  // Ultrasonic Pins
  pinMode(TRIG_PIN_1, OUTPUT);
  pinMode(ECHO_PIN_1, INPUT);
  pinMode(TRIG_PIN_2, OUTPUT);
  pinMode(ECHO_PIN_2, INPUT);

  // Buzzer
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  Serial.println("\n🚀 Booting SmartRoad AI Dual-Sensor ESP32 Firmware...");

  setupWiFi();
  setupCamera();
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
}

void loop() {
  if (!mqttClient.connected()) {
    reconnectMQTT();
  }
  mqttClient.loop();

  // Feed GPS Serial Buffer
  while (gpsSerial.available() > 0) {
    gps.encode(gpsSerial.read());
  }

  // Sample Both Ultrasonic Sensors
  float distance1 = readUltrasonic(TRIG_PIN_1, ECHO_PIN_1); // Left Track
  float distance2 = readUltrasonic(TRIG_PIN_2, ECHO_PIN_2); // Right Track

  // Evaluate Hazard Thresholds
  checkRoadConditions(distance1, distance2);

  // Periodic Telemetry & Heartbeat
  if (millis() - lastHeartbeat > HEARTBEAT_INTERVAL) {
    lastHeartbeat = millis();
    sendHeartbeat(distance1, distance2);
  }

  delay(200); // 5Hz Sampling Rate
}

// Setup WiFi Connection
void setupWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(WIFI_SSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\n✅ WiFi Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

// Setup ESP32-CAM OV2640 Camera
void setupCamera() {
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;

  if (psramFound()) {
    config.frame_size = FRAMESIZE_VGA;
    config.jpeg_quality = 10;
    config.fb_count = 2;
  } else {
    config.frame_size = FRAMESIZE_SVGA;
    config.jpeg_quality = 12;
    config.fb_count = 1;
  }

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x\n", err);
  } else {
    Serial.println("📷 ESP32-CAM Vision System Ready!");
  }
}

// Maintain MQTT Broker Connection
void reconnectMQTT() {
  while (!mqttClient.connected()) {
    Serial.print("Connecting to MQTT Broker...");
    if (mqttClient.connect(DEVICE_ID)) {
      Serial.println(" Connected!");
    } else {
      Serial.print(" Failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" Retrying in 5 seconds...");
      delay(5000);
    }
  }
}

// Measure HC-SR04 Distance (cm)
float readUltrasonic(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 30000);
  if (duration == 0) return BASELINE_CLEARANCE;

  return (duration * 0.0343) / 2.0;
}

// Evaluate Dual Ultrasonic Sensors & Trigger Email + MQTT
void checkRoadConditions(float dist1, float dist2) {
  float maxDist = max(dist1, dist2);
  float minDist = min(dist1, dist2);

  String hazardType = "";
  String severity = "";
  float triggerDist = BASELINE_CLEARANCE;
  String sensorSource = "";

  if (maxDist > POTHOLE_THRESHOLD) {
    hazardType = "POTHOLE";
    triggerDist = maxDist;
    sensorSource = (dist1 > POTHOLE_THRESHOLD) ? "Sensor 1 (Left Track)" : "Sensor 2 (Right Track)";
    severity = (triggerDist > 60.0) ? "CRITICAL" : "HIGH";
  } else if (minDist < BUMP_THRESHOLD) {
    hazardType = "ROAD_BUMP";
    triggerDist = minDist;
    sensorSource = (dist1 < BUMP_THRESHOLD) ? "Sensor 1 (Left Track)" : "Sensor 2 (Right Track)";
    severity = (triggerDist < 14.0) ? "HIGH" : "MEDIUM";
  }

  if (hazardType.length() > 0) {
    // Sound Buzzer
    digitalWrite(BUZZER_PIN, HIGH);

    double lat = gps.location.isValid() ? gps.location.lat() : 26.7271;
    double lng = gps.location.isValid() ? gps.location.lng() : 88.3953;

    // Build MQTT JSON Payload
    StaticJsonDocument<384> doc;
    doc["id"]           = String("det-") + String(millis());
    doc["deviceId"]     = DEVICE_ID;
    doc["type"]         = hazardType;
    doc["severity"]     = severity;
    doc["confidence"]   = 96;
    doc["distance"]     = triggerDist;
    doc["sensor1"]      = dist1;
    doc["sensor2"]      = dist2;
    doc["source"]       = sensorSource;
    doc["latitude"]      = lat;
    doc["longitude"]    = lng;
    doc["timestamp"]    = String(millis());

    char jsonBuffer[512];
    serializeJson(doc, jsonBuffer);
    mqttClient.publish("smartroad/detections", jsonBuffer);

    // Send Urgent SMTP Email Notification if CRITICAL hazard
    if (severity == "CRITICAL") {
      sendSMTPEmail(hazardType, triggerDist, lat, lng);
    }

    delay(800);
    digitalWrite(BUZZER_PIN, LOW);
  }
}

// Send Automatic SMTP Email Alert to Road Authorities
void sendSMTPEmail(String hazardType, float dist, double lat, double lng) {
  Serial.println("📧 Preparing Urgent SMTP Email Alert...");

  Session_Config config;
  config.server.host_name = SMTP_HOST;
  config.server.port = SMTP_PORT;
  config.login.email = AUTHOR_EMAIL;
  config.login.password = AUTHOR_PASSWORD;

  SMTP_Message message;
  message.sender.name = "SmartRoad AI Emergency System";
  message.sender.email = AUTHOR_EMAIL;
  message.subject = "[URGENT] Severe " + hazardType + " Hazard Detected!";
  message.addRecipient("Road Maintenance Officer", RECIPIENT_EMAIL);

  String htmlMsg = "<div style='font-family: Arial; padding: 20px; background: #0b0f19; color: #f8fafc; border-radius: 10px;'>"
                   "<h2 style='color: #ef4444;'>⚠️ CRITICAL ROAD HAZARD REPORT</h2>"
                   "<p><b>Hazard Type:</b> " + hazardType + "</p>"
                   "<p><b>Depth / Reading:</b> " + String(dist) + " cm</p>"
                   "<p><b>Device ID:</b> " + String(DEVICE_ID) + "</p>"
                   "<p><b>GPS Coordinates:</b> [" + String(lat, 5) + ", " + String(lng, 5) + "]</p>"
                   "<p><a href='https://maps.google.com/?q=" + String(lat, 5) + "," + String(lng, 5) + "' style='color: #38bdf8;'>📍 Open in Google Maps</a></p>"
                   "</div>";

  message.html.content = htmlMsg.c_str();

  if (!smtp.connect(&config)) {
    Serial.println("Error connecting to SMTP server");
    return;
  }

  if (!MailClient.sendMail(&smtp, &message)) {
    Serial.println("Error sending Email: " + smtp.errorReason());
  } else {
    Serial.println("✅ Urgent SMTP Email Alert Sent Successfully!");
  }
}

// Periodic Telemetry Heartbeat
void sendHeartbeat(float dist1, float dist2) {
  double lat = gps.location.isValid() ? gps.location.lat() : 26.7271;
  double lng = gps.location.isValid() ? gps.location.lng() : 88.3953;

  StaticJsonDocument<384> doc;
  doc["deviceId"]     = DEVICE_ID;
  doc["status"]       = "ONLINE";
  doc["sensor1"]      = dist1;
  doc["sensor2"]      = dist2;
  doc["latitude"]     = lat;
  doc["longitude"]    = lng;
  doc["batteryLevel"] = 94;
  doc["wifiSignal"]   = WiFi.RSSI();
  doc["firmware"]     = "v2.5.0-DUAL";

  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer);
  mqttClient.publish("smartroad/heartbeat", jsonBuffer);
}
