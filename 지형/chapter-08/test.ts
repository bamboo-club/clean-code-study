class Sensors {
  sensors: Map<number, string>;

  constructor() {
    this.sensors = new Map<number, string>();
  }

  getById(id) {
    return this.sensors.get(id);
  }
}
