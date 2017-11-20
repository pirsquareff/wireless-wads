import DEVICES from './deviceData.json';

class DeviceDataService {
  constructor() {
    this.devices = new Map();
    this.importData();
  }

  importData() {
    this.devices.set();
    const that = this;
    DEVICES.map(that.addDevice);
  }

  addDevice(device) {
    const key = device.id;
    this.devices.set(key, device);
  }

  getDevice(id) {
    return this.devices.get(id);
  }
}

export default DeviceDataService;
