/*
 * =====================================================================================
 * SmartRoad AI - ESP32 Hardware Firmware
 * IoT Pothole & Road Bump Detection System
 * 
 * Hardware Requirements:
 * - ESP32 Dev Module / ESP32-CAM
 * - HC-SR04 Ultrasonic Distance Sensor (Trig: GPIO 5, Echo: GPIO 18)
 * - NEO-6M GPS Module (TX: GPIO 16, RX: GPIO 17)
 * - Active 5V Buzzer (GPIO 19)
 * - OV2640 Camera Module (Optional for snapshot uploads)
 * 
 * Dependencies (Install via Arduino Library Manager):
 * 1. PubSubClient by Nick O'Leary
 * 2. ArduinoJson by Benoit Blanchon (v6+)
 * 3. TinyGPS++ by Mikal Hart
 * =====================================================================================
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <TinyGPS++.h>
#include <ArduinoJson.h>

// --- WiFi & MQTT Configuration ---
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASS = "YOUR_WIFI_PASSWORD";

// Public MQTT Broker (Or replace with local broker IP, e.g. 192.168.1.100)
const char* MQTT_BROKER   = "broker.emqx.io";
const int   MQTT_PORT     = 1883;
const char* DEVICE_ID     = "ESP32-ROAD-001";

// MQTT Topics
const char* TOPIC_DETECTIONS = "smartroad/detections";
const char* TOPIC_TELEMETRY  = "smartroad/telemetry";
const char* TOPIC_HEARTBEAT  = "smartroad/heartbeat";

// --- Hardware Pin Definitions ---
#define TRIG_PIN  5
#define ECHO_PIN  18
#define BUZZER_PIN 19

#define GPS_RX_PIN 16
#define GPS_TX_PIN 17

// --- Threshold Parameters (in cm) ---
const float BASELINE_CLEARANCE = 32.4;
const float POTHOLE_THRESHOLD  = 45.0; // Distance > 45cm => Road cavity/pothole
const float BUMP_THRESHOLD     = 20.0; // Distance < 20cm => Bump elevation

// --- Global Objects & Variables ---
WiFiClient espClient;
PubSubClient mqttClient(espClient);
TinyGPSPlus gps;
HardwareSerial gpsSerial(2);

unsigned long lastHeartbeat = 0;
const unsigned long HEARTBEAT_INTERVAL = 5000; // 5 Seconds

// --- Function Prototypes ---
void setupWiFi();
void reconnectMQTT();
float readUltrasonicDistance();
void checkRoadConditions(float distance);
void sendHeartbeat(float distance);

void setup() {
  Serial.begin(115200);
  gpsSerial.begin(9600, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  Serial.println("\n🚀 Booting SmartRoad AI ESP32 Firmware...");

  setupWiFi();
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
}

void loop() {
  if (!mqttClient.connected()) {
    reconnectMQTT();
  }
  mqttClient.loop();

  // Feed GPS Serial buffer
  while (gpsSerial.available() > 0) {
    gps.encode(gpsSerial.read());
  }

  // Sample Ultrasonic Distance Sensor
  float currentDistance = readUltrasonicDistance();

  // Evaluate for Pothole or Bump Hazards
  checkRoadConditions(currentDistance);

  // Send Periodic Heartbeat Telemetry
  if (millis() - lastHeartbeat > HEARTBEAT_INTERVAL) {
    lastHeartbeat = millis();
    sendHeartbeat(currentDistance);
  }

  delay(200); // 5Hz Sampling Rate
}

// Setup WiFi Connection
void setupWiFi() {
  delay(10);
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

// Maintain MQTT Connection
void reconnectMQTT() {
  while (!mqttClient.connected()) {
    Serial.print("Attempting MQTT connection to ");
    Serial.print(MQTT_BROKER);
    Serial.print("...");

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

// Measure HC-SR04 Distance in cm
float readUltrasonicDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000); // 30ms timeout
  if (duration == 0) return BASELINE_CLEARANCE;   // Default fallback if out of range

  float distance = (duration * 0.0343) / 2.0;
  return distance;
}

// Evaluate Thresholds & Trigger MQTT Alert
void checkRoadConditions(float distance) {
  String hazardType = "";
  String severity = "";

  if (distance > POTHOLE_THRESHOLD) {
    hazardType = "POTHOLE";
    severity = (distance > 60.0) ? "CRITICAL" : "HIGH";
  } else if (distance < BUMP_THRESHOLD) {
    hazardType = "ROAD_BUMP";
    severity = (distance < 14.0) ? "HIGH" : "MEDIUM";
  }

  if (hazardType.length() > 0) {
    // Sound Buzzer Alert
    digitalWrite(BUZZER_PIN, HIGH);

    // Get GPS Coordinates (or fallback mock coordinates)
    double lat = gps.location.isValid() ? gps.location.lat() : 26.7271;
    double lng = gps.location.isValid() ? gps.location.lng() : 88.3953;

    // Create JSON Payload
    StaticJsonDocument<256> doc;
    doc["id"]          = String("det-") + String(millis());
    doc["deviceId"]    = DEVICE_ID;
    doc["type"]        = hazardType;
    doc["severity"]    = severity;
    doc["confidence"]  = 95;
    doc["distance"]    = distance;
    doc["latitude"]    = lat;
    doc["longitude"]   = lng;
    doc["timestamp"]   = String(millis());

    char jsonBuffer[512];
    serializeJson(doc, jsonBuffer);

    Serial.print("⚠️ HAZARD DETECTED! Publishing MQTT Payload: ");
    Serial.println(jsonBuffer);

    mqttClient.publish(TOPIC_DETECTIONS, jsonBuffer);

    delay(800); // Alert cooldown
    digitalWrite(BUZZER_PIN, LOW);
  }
}

// Send Heartbeat & Sensor Health Data
void sendHeartbeat(float distance) {
  double lat = gps.location.isValid() ? gps.location.lat() : 26.7271;
  double lng = gps.location.isValid() ? gps.location.lng() : 88.3953;

  StaticJsonDocument<256> doc;
  doc["deviceId"]      = DEVICE_ID;
  doc["status"]        = "ONLINE";
  doc["distance"]      = distance;
  doc["latitude"]      = lat;
  doc["longitude"]     = lng;
  doc["batteryLevel"]  = 94;
  doc["wifiSignal"]    = WiFi.RSSI();
  doc["firmware"]      = "v2.4.1";

  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer);

  mqttClient.publish(TOPIC_HEARTBEAT, jsonBuffer);
}
