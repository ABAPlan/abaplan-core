import OpenStreetMapLayer = require("esri/layers/OpenStreetMapLayer");

export default class OsmSubLayer extends OpenStreetMapLayer {
  public id: string = "osm";
  constructor() {
    super();
    this.setMaxScale(25);
  }
}
