/**
 * helper for 2d vectors operations
 * (jca)
 */


export interface Vector2d { x: number, y: number }

/*
 * clone a vector
 */
export function clone(v: Vector2d){
  return {
    x: v.x,
    y: v.y
  }
}

/*
 * get a perpendicular vector
 */
export function perp(v: Vector2d) {
  return {
    x: -v.y,
    y: v.x
  }
}

/*
 * addVec sum two 2d vectors
 */
export function addVec(v1: Vector2d, v2: Vector2d){
  return {
    x: v1.x + v2.x,
    y: v1.y + v2.y
  };
}

/*
 * subVec substrac v2 from v1
 */
export function subVec(v1: Vector2d, v2: Vector2d) {
  return addVec(v1, { x: -v2.x, y: -v2.y });
}

/*
 * subVec substrac v2 from v1
 */
export function norm(v: Vector2d) {
  return Math.sqrt( v.x*v.x + v.y*v.y );
}

/*
 * multVec multiply a v vector by a factor n
 */
export function multVec(n: number, v: Vector2d) {
    return {
        x: v.x * n,
        y: v.y * n
    };
}



