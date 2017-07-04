import { Injectable } from '@angular/core';

export type Mode = ReadingMode | SearchingMode | ItineraryMode;
export interface ReadingMode { mode: "reading" }
export interface SearchingMode { mode: "searching" }
export interface ItineraryMode { mode: "itinerary"}


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
