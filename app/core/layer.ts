export type LayerType = City | Square | Osm;
interface City { kind: "city"; }
interface Square { kind: "square"; }
interface Osm { kind: "osm"; }