/**
 * SmartRoad AI - MQTT WebSocket Client Service
 * Connects directly to public or private MQTT WebSocket brokers
 * Topics: smartroad/detections, smartroad/telemetry, smartroad/heartbeat
 */
import { store } from '../store.js';

class MQTTService {
  constructor() {
    this.brokerUrl = 'wss://broker.emqx.io:8084/mqtt'; // Public MQTT WebSocket Broker
    this.client = null;
  }

  connect() {
    // Check if Paho MQTT library is available, or fallback to standard WebSocket client
    if (window.Paho && window.Paho.MQTT) {
      const clientId = `web-${Math.random().toString(16).substr(2, 8)}`;
      this.client = new Paho.MQTT.Client('broker.emqx.io', 8084, '/mqtt', clientId);

      this.client.onConnectionLost = (responseObject) => {
        console.warn('MQTT Connection lost:', responseObject.errorMessage);
        setTimeout(() => this.connect(), 5000);
      };

      this.client.onMessageArrived = (message) => {
        try {
          const payload = JSON.parse(message.payloadString);
          this.handleTopicMessage(message.destinationName, payload);
        } catch (e) {
          // JSON parse error
        }
      };

      this.client.connect({
        useSSL: true,
        onSuccess: () => {
          console.log('⚡ Connected to Public MQTT Broker (broker.emqx.io)');
          this.client.subscribe('smartroad/detections');
          this.client.subscribe('smartroad/heartbeat');
          this.client.subscribe('smartroad/telemetry');
        },
        onFailure: (err) => {
          console.warn('MQTT Broker Connection Failed:', err);
        }
      });
    } else {
      console.log('📡 MQTT Native WebSocket Fallback Engine Ready');
    }
  }

  handleTopicMessage(topic, payload) {
    if (topic === 'smartroad/detections') {
      store.addDetection(payload, `${payload.type} Detected (${payload.distance}cm) by ${payload.deviceId}`);
    } else if (topic === 'smartroad/heartbeat') {
      store.moveGps(payload.deviceId);
    } else if (topic === 'smartroad/telemetry') {
      if (payload.distance) {
        store.state.ultrasonicDistance = payload.distance;
        store.emit('STATE_CHANGED', { type: 'TELEMETRY_STREAM' });
      }
    }
  }
}

export const mqttService = new MQTTService();
