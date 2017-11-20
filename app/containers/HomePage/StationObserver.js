import mqtt from 'mqtt';

const mqttHost = 'ws://35.198.193.141:8000/mqtt';
const mqttTopic = 'wads/project/dev';

export default class StationObserver {
  constructor(onChange) {
    this.stations = new Map();
    this.setupMqtt();
    this.onChange = onChange;
  }

  setupMqtt() {
    console.log('DeviceNodeList:: componentDidMount');
    const that = this;
    this.client = mqtt.connect(mqttHost, {
      protocolId: 'MQIsdp',
      protocolVersion: 3,
    });
    this.client.on('connect', () => {
      console.log('DeviceNodeList#client:: connected');
      that.client.subscribe(mqttTopic);
    });
    this.client.on('message', (topic, message) => {
      if (topic === mqttTopic) {
        console.log(message.toString());
        const jsonMessage = JSON.parse(message);
        that.updateStation({
          data: jsonMessage,
        });
      }
    });
  }

  updateStation(station) {
    if (station.data.devices.length === 0) {
      this.stations.delete(station.data.fromRaspId);
    } else {
      this.stations.set(station.data.fromRaspId, station.data);
    }
    this.onChange(this.stations);
  }
}
