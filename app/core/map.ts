import ArcgisMap = require('esri/map');
import Graphic = require('esri/graphic');
import Extent = require('esri/geometry/Extent');
import OpenStreetMapLayer = require('esri/layers/OpenStreetMapLayer');

import {AbaLayer, CityBrailleLayer, SquareBrailleLayer, OsmLayer, LayerType, Osm} from './layer';

import Draw = require('esri/toolbars/draw');
import SimpleLineSymbol = require('esri/symbols/SimpleLineSymbol');
import PictureFillSymbol = require('esri/symbols/PictureFillSymbol');
import SimpleFillSymbol = require('esri/symbols/SimpleFillSymbol');
import Symbol = require('esri/symbols/Symbol');
import Color = require('esri/Color');
import Polygon = require('esri/geometry/Polygon');


interface CircleDrawType { kind: 'circle' }
interface PolygonDrawType { kind: 'polygon' }
interface LineDrawType { kind: 'line' }
interface PedestrianDrawType { kind: 'pedestrian' }

export type DrawType =
  ( CircleDrawType  |
    PolygonDrawType |
    LineDrawType    |
    PedestrianDrawType);

interface DrawInfo {
  geometryType : string;
  drawComplete(map : ArcgisMap, event) : void;
};

/**
 * Base class for basic geometry type
 */
class DrawInfoBasicGeometry implements DrawInfo{
  private symbol : Symbol;
  public geometryType : string;

  constructor(geometryType : string, symbol: Symbol) {
    this.geometryType = geometryType;
    this.symbol = symbol;
  }

  drawComplete(map : ArcgisMap, event) {
    console.log(event);
    map.graphics.add(new Graphic(event.geometry, this.symbol));
  }
}

class DrawInfoPedestrian implements DrawInfo {
  public geometryType : string = "LINE";
  public pedestrianFillSize : number = 20;
  constructor() {

  }

  drawComplete(map : ArcgisMap, event) {
    //map.graphics.add(new Graphic(event.geometry, this.symbol));
    var A = {x:0, y:0};
    A.x = event.geometry.paths[0][0][0];
    A.y = event.geometry.paths[0][0][1];

    var B = { x: 0, y: 0 };
    B.x = event.geometry.paths[0][1][0];
    B.y = event.geometry.paths[0][1][1];

    this.createPedestrianPathway(A, B, event.geometry.spatialReference, map);
  }

  /**
  * Calcul de la prochaine coordonnées d'un point du passage 
  * Piétons tel que la distance soit toujours constante
  * Résoudre les équations y = mx + k et d = sqrt(pow(x2-x1, 2) + pow(y2-y1, 2))
  */
  nextCoord (A, l, m, k, D1, D2) {
    var a = Math.pow(m, 2) + 1;
    var b = (2 * k * m) - (2 * A.y * m) - (2 * A.x);
    var c = Math.pow(k, 2) - (2 * A.y * k) + Math.pow(A.x, 2) + Math.pow(A.y, 2) - Math.pow(l, 2);

    var delta = Math.pow(b, 2) - (4 * a * c);
    var x;
    var y;

    if (delta < 0) {
      console.log("pas de solution");
    } else if (delta == 0) {
      x = (-b) / (2 * a);
    } else {
      var p1 = ((-b) - Math.sqrt(delta)) / (2 * a);
      var p2 = ((-b) + Math.sqrt(delta)) / (2 * a);
      if (D2.x - D1.x >= 0) {
        x = (p1 > p2) ? p1 : p2;
      } else {
        x = (p1 < p2) ? p1 : p2;
      }
    }

    y = m * x + k;

    return { x: x, y: y };
  }

  createPedestrianPathway (A, B, spatialRef, arcgisMap) {

    // Distance entre les deux points composant le segment de droite dessiné
    var AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
    // Pente entre les points A et B
    var m = (B.y - A.y) / (B.x - A.x); 
    var k = A.y - (m * A.x); // ordonnée à l'origine de la droite décrite par les points A et B

    // longueur et largeur d'une bande du passage piétons
    let pedestrianFillSizeZoom = this.pedestrianFillSize - arcgisMap.getZoom();
    console.log(pedestrianFillSizeZoom);
    var l = 2.5 * pedestrianFillSizeZoom;
    var h = 5 * pedestrianFillSizeZoom;

    // Théorème de Thalès
    var x = h * (B.y - A.y) / AB;
    var y = h * (B.x - A.x) / AB;
    
    console.log(Math.round(AB / l));

    var C = { x: A.x - x, y: A.y + y };
    var D = { x: 0, y: 0 };
    var E = { x: 0, y: 0 };
    var F = { x: A.x + x, y: A.y - y };
    var geometries = [];
    for (var i = 0; i < Math.round(AB / l) ; i++) {
      // Calcul des points du rectangle autour du segment de droite
      
      k = C.y - (m * C.x);
      C = this.nextCoord(C, l, m, k, A, B);
      D = this.nextCoord(C, l, m, k, A, B);

      k = F.y - (m * F.x);
      F = this.nextCoord(F, l, m, k, A, B);
      E = this.nextCoord(F, l, m, k, A, B);

      // Création du rectangle autour de la droite
      var geometry = new Polygon([[C.x, C.y], [D.x, D.y], [E.x, E.y], [F.x, F.y], [C.x, C.y]]);
      geometry.setSpatialReference(spatialRef);
      var symbol;
      if((i+1)%2){
        symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, null, new Color([0, 0, 0, 1]));
      }else{
        symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, null, new Color([255, 255, 255, 1]));
      }

      geometries.push(geometry);
      //console.log(EditTools.getNbPP());

      arcgisMap.graphics.add(new Graphic(geometry, symbol, { "shape": this.geometryType, "texture": symbol, "passage_pieton": true/*, "id": EditTools.getNbPP()*/ }));

    }

    //////// EditTools.ppAdded();

    console.log(geometries.length + " polygon required to draw this pedestrian pathways");
    console.log(geometries.length);

    // Créé une geometrie avec tous les polygones, mais on ne peut plus avoir une alternance de noir/blanc 
    // puisqu'un seul polygone avec un symbole
    //geometry = geometryEngine.union(geometries);
    //this.arcgisMap.graphics.add(new Graphic(geometry, symbol, { "shape": this.currentToolname, "texture": this.fillType, "passage_pieton": true }));

  };

}

export class OptionMap {
  public constructor(
    public uid: number,
    public height: number,
    public width: number,
    public layerType: LayerType,
    public extent: string,
    public title?: string,
    public owner?: number,
    public graphics?: string,
    public hash?: string,
    public dateCreation?: string,
  ) {}

}

export class AbaMap extends ArcgisMap {

  private layers: AbaLayer[] = [];



  public uid?: number;
  public title?: string;
  public owner?: number;
  public hash?: string;
  public dateCreation?: string;


  private draw: Draw;
  private currentDrawInfo : DrawInfo;

  private drawTypes : { [name:string] : DrawInfo; } = {
    'circle' : 
      new DrawInfoBasicGeometry(
        "CIRCLE", 
        new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, null,
           new Color([0, 0, 0, 1]))  
      ),
    'polygon' : 
      new DrawInfoBasicGeometry(
        "POLYGON", 
        new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, null,
           new Color([0, 0, 0, 1]))  
      ),
    'line' : 
      new DrawInfoBasicGeometry(
        "POLYLINE", 
        (new SimpleLineSymbol())
                .setStyle(SimpleLineSymbol.STYLE_LONGDASH)
                .setWidth(3)
      ),
    'pedestrian' : new DrawInfoPedestrian()
  };

  // Create a new fresh instance
  public constructor(divId: Node | string, extent?: Extent) {

    super(divId, { logo: false, slider: false });


    this.draw = new Draw(this);
    this.draw.on("draw-complete", (event) => {
      // Draw Complete 
      this.currentDrawInfo.drawComplete(this, event);

      console.log(event);
    });

    this.draw.on("draw-complete", (event) => {
      // Draw Complete 
      this.currentDrawInfo.drawComplete(this, event);

      console.log(event);
    });

    if(!extent){
      extent = new Extent({
        xmin: 780000.0,
        ymin: 5720000.0,
        xmax: 1105000.0,
        ymax: 6100000.0,
        spatialReference: {
          wkid: 102100
        }
      });
    }

    this.setExtent(extent);

    this.layers.push(new OsmLayer());
    this.layers.push(new SquareBrailleLayer());
    this.layers.push(new CityBrailleLayer());

    this.addLayers(this.layers);

    this.setLayerVisible({kind:"osm"});

  }

  public setLayerVisible(layerType: LayerType) {
    this.layers
      .forEach( (layer) =>
        layer.setVisibility(layer.id === layerType.kind)
      );
  }

  public setEditableMode(editableMode : boolean){
    if(editableMode)
      this.draw.activate(Draw.CIRCLE);
    else
      this.draw.deactivate();
  }

  public setDrawType(drawType : DrawType){
    console.log(drawType);
    this.currentDrawInfo = this.drawTypes[drawType.kind];
    this.draw.activate(Draw[this.currentDrawInfo.geometryType]);
  }

  public static fromOptionMap(divId: Node | string, optionMap: OptionMap): AbaMap {

    const abaMap: AbaMap = new AbaMap(divId, new Extent(JSON.parse(optionMap.extent)));

    abaMap.uid = optionMap.uid;
    abaMap.height = optionMap.height;
    abaMap.width = optionMap.width;

    abaMap.setLayerVisible(optionMap.layerType);

    abaMap.title = optionMap.title;
    abaMap.owner = optionMap.owner;

    if(optionMap.graphics) {
      const json: any = JSON.parse(optionMap.graphics);
      json.forEach( (graphic) => abaMap.graphics.add(new Graphic(graphic)));
    }

    abaMap.hash = optionMap.hash;
    abaMap.dateCreation = optionMap.dateCreation;

    return abaMap;

  }
}
