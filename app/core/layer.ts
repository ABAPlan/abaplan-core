export type LayerType = City | Square | Osm;
interface City { kind: "city"; }
interface Square { kind: "square"; }
export interface Osm { kind: "osm"; }