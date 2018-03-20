// import { GeoJsonObject } from "geojson";

declare module 'tokml' {
    interface Options {
        name?: string;
        description?: string;
        timestamp?: string;
        documentName?: string;
        documentDescription?: string;
        simplestyle?: boolean;
    }

    function tokml(geojsonObject: GeoJsonObject, options: tokml.Options): string;
    
    namespace tokml {} // workaround: https://github.com/Microsoft/TypeScript/issues/5073#issue-109478860
    export = tokml;
}