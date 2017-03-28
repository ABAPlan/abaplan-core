import { Injectable } from '@angular/core';

export type Mode = ReadingMode | SearchingMode;
export interface ReadingMode { mode: "reading" };
export interface SearchingMode { mode: "searching" };

@Injectable()
export class StateService {

  private _activeMode: Mode = { mode: "reading" };

  constructor() { }

  public changeMode(newMode: Mode): void {
    this._activeMode = newMode;
  }

  public activeMode(): Mode {
    return this._activeMode;
  }


}
