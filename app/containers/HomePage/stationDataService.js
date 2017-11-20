import STATIONS from './stationData.json';

class StationDataService {
  constructor() {
    this.stations = new Map();
    this.importData();
  }

  importData() {
    STATIONS.map(this.addStation.bind(this));
  }

  addStation(station) {
    const key = station.id;
    this.stations.set(key, station);
  }

  getStation(id) {
    return this.stations.get(id);
  }
}

export default StationDataService;
