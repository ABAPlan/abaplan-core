/**
 * helper for polygons
 * (jca)
 */

import * as _ from "lodash";
import Graphic = require("esri/graphic");

// Segment is a structure of type [ Vertex (in), Vertex (out) ]
// where Vertex is a structure of [ number (x) , number (y) ]
type Vertex = number[];
type Segment = Vertex[];

type Tuple = number[];

// Detect and remove cut off paths. Mutate the graphics.
// * Enumerates all combination of comparative paths
// * For each, detects segments' intersections and remove them
export function removeCommonSegments(xs: Graphic[]) {

  enumerate(xs.length).forEach( ([a, b]: Tuple) => {
    const g1: any = xs[a];
    const g2: any = xs[b];

    const xWindow = commonCoordinates( [g1.geometry.xmin, g1.geometry.xmax], [g2.geometry.xmin, g2.geometry.xmax] );
    const yWindow = commonCoordinates( [g1.geometry.ymin, g1.geometry.ymax], [g2.geometry.ymin, g2.geometry.ymax] );

    if ( !(xWindow.length == 0 || yWindow.length == 0) ) {

      // Filter only segments inside x and y windows
      const g1FilteredRings = _.filter(g1.geometry.rings, (segment: Segment) => isInside(segment, xWindow, yWindow));
      const g2FilteredRings = _.filter(g2.geometry.rings, (segment: Segment) => isInside(segment, xWindow, yWindow));

      // Compare only segments inside the same window (on x and y)
      _.intersectionWith(g1FilteredRings, g2FilteredRings, isSameSegments).forEach( (s1: Segment) => {
        _.remove(g1.geometry.rings, (s2: Segment) => isSameSegments(s1, s2));
        _.remove(g2.geometry.rings, (s2: Segment) => isSameSegments(s1, s2));
      })
    }

  });
}

// Enumerate tuple of n combinations
// By example, enumerate(3) will return [[0,1], [0, 2], [1, 2]]
function enumerate(n: number): Tuple[] {

  let ys: Tuple[] = [];
  let processed: number[] = [];
  let xs = _.range(0, n);
  xs.forEach( (x) => {
    processed.push(x);
    let zs = _.difference(xs, processed);
    zs.forEach( (z) => ys.push([x, z]));
  });
  return ys;

}

// Returns if two segments are identical
function isSameSegments(s1: Segment, s2: Segment): boolean  {
  return (s1[0][0] === s2[0][0] && s1[0][1] === s2[0][1]) && (s1[1][0] === s2[1][0] && s1[1][1] === s2[1][1]) ||
    (s1[0][0] === s2[1][0] && s1[0][1] === s2[1][1]) && (s1[1][0] === s2[0][0] && s1[1][1] === s2[0][1]);
}

// Returns common coordinates of two collinear segments
function commonCoordinates( segment1: Tuple, segment2: Tuple): Tuple {
  const [s1min, s1max] = segment1;
  const [s2min, s2max] = segment2;
  const a = Math.max(s1min, s2min);
  const b = Math.min(s1max, s2max);
  if ( a < b ) {
    return [a, b];
  }else{
    return [];
  }
}

// Returns true if at least one vertex of the segment is inside a Window area
function isInside(segment: Segment, xWindow: Tuple, yWindow: Tuple): boolean {
  const vertex1: Vertex = segment[0];
  const vertex2: Vertex = segment[1];
  const v1InsideWindow = (xWindow[0] <= vertex1[0] && vertex1[0] <= xWindow[1]) && (yWindow[0] <= vertex1[1] && vertex1[1] <= yWindow[1]);
  const v2InsideWindow = (xWindow[0] <= vertex2[0] && vertex2[0] <= xWindow[1]) && (yWindow[0] <= vertex2[1] && vertex2[1] <= yWindow[1]);

  return v1InsideWindow || v2InsideWindow;
}
