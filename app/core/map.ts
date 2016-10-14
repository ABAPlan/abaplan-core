// Enum for the kind of map
type MapType = City | Square;
interface City { kind: "city"; }
interface Square { kind: "square"; }

// Map class
export class Map {
  constructor(
    private id?: number,
    private title?: string,
    private height: number,
    private width: number,
    private mapType: MapType,
    private owner?: number,
    private graphics?: string = "",
    private hash?: string,
    private dateCreation?: string
  ) {}

}