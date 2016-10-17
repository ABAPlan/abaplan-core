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
    private title?: string,
    private owner?: number,
    private graphics?: string,
    private hash?: string,
    private dateCreation?: string,
  ) {}

}