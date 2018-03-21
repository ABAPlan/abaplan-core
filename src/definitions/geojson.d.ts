declare module 'geojson' {
    interface dataType {}

    interface settingsType {}

    function parse(data: dataType, settings: settingsType, callback?: Function): string;
}
