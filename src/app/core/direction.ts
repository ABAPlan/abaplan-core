/**
 * Created by joel on 29.03.17.
 */

export type Direction =
  | Upper
  | Lower
  | Right
  | Left
  | UpperRight
  | UpperLeft
  | LowerRight
  | LowerLeft
  | Center;
export interface Upper {
  direction: "upper";
}
export interface Lower {
  direction: "lower";
}
export interface Right {
  direction: "right";
}
export interface Left {
  direction: "left";
}
export interface UpperRight {
  direction: "upper_right";
}
export interface UpperLeft {
  direction: "upper_left";
}
export interface LowerRight {
  direction: "lower_right";
}
export interface LowerLeft {
  direction: "lower_left";
}
export interface Center {
  direction: "center";
}
