import ArcgisMap = require('esri/map');
import Graphic = require('esri/graphic');
import Extent = require('esri/geometry/Extent');
import OpenStreetMapLayer = require('esri/layers/OpenStreetMapLayer');

// Enum for the kind of map
export type MapType = City | Square;
interface City { kind: "city"; }
interface Square { kind: "square"; }



// Map class
export class Map {
  constructor(
    private id: number,
    private height: number,
    private width: number,
    private mapType: MapType,
    private extent: string,
    private title?: string,
    private owner?: number,
    private graphics?: string,
    private hash?: string,
    private dateCreation?: string,
  ) {}

}








