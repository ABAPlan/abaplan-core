/**
 * helper for 2d vectors operations
 * (jca)
 */


export interface Vector2d { x: number, y: number }
export interface Plane2d { A: Vector2d, B: Vector2d, C: Vector2d, D: Vector2d }

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

/*
 * cross_z is the vectorial product of 2d vectors for
 * the z coordinates
 */
export function cross_z(p1: Vector2d, p2: Vector2d) {
  return p1.x * p2.y - p1.y * p2.x;
}

/*
 * det is the determinant of two vector forming a
 * square matrix.
 * Note: For a 2d Matrix, it corresponds to a cross_z
 *       function
 */
function det(v1: Vector2d, v2: Vector2d) {
  return cross_z(v1, v2);
}

/*
 * transform returns the coordinates in a well scaled plan.
 *
 * We use barycentric coordinate system to apply linear transformation helping
 * to find the final coordinates in an well scaled plan from a deformed plan
 *
 * Algo:
 * - Divide the plan between two triangles
 * - Find if a P ponint is on the left or on the right of BC
 * - Apply barycentric coordinate system to find alpha, beta and gamma
 *   parameters
 * - Thanks to these parameters, transform the coordinates according
 *   to the well scaled vertices.
 *
 *
 *    A ------ C        A --------- C
 *   /     __/ |        |      ___/ |
 *   |  __/    \    =>  |  ___/     |
 *   / /     x  \       | /      x  |
 *  B -----_____ D      B --------- D
 */
function transform(OP: Vector2d, O: Plane2d, finalPlan: Plane2d) {

  const PA = subVec(O.A, OP); // PA = OA - OP;
  const PB = subVec(O.B, OP); // PB = OB - OP;
  const PC = subVec(O.C, OP); // PC = OC - OP;
  const PD = subVec(O.D, OP); // PD = OD - OP;

  const BC = subVec(O.C, O.B); // BC = OC - OB
  const BP = subVec(OP, O.B);  // BP = OP - OB

  let PX;     // PX is PA or PD
  let finalX; // finalX is PA' or PD'

  // According to the position of OP, we need to consider a specific area
  if (cross_z(BP, BC) >= 0) {
    /*
     *  A --------- C
     *  |  P   ___/ |
     *  |  ___/     |
     *  | /         |
     *  B --------- D
     */
    PX = PA;
    finalX = finalPlan.A;
  } else {
    /*
     *  A --------- C
     *  |      ___/ |
     *  |  ___/     |
     *  | /     P   |
     *  B --------- D
     */
    PX = PD;
    finalX = finalPlan.D;
  }

  // Apply barycentric coordinates system to find the main parameters
  const alpha = det(PB, PC);
  const beta = det(PC, PX);
  const gamma = det(PX, PB);

  // transformation. P_ is P'
  const total = alpha + beta + gamma;
  const P_ = (addVec(multVec(alpha, finalX), addVec(multVec(beta, finalPlan.B), multVec(gamma, finalPlan.C))));
  P_.x /= total;
  P_.y /= total;

  return P_;

}