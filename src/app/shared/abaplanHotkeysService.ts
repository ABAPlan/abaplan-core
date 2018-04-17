import { Injectable } from "@angular/core";
import { Hotkey, HotkeysService } from "angular2-hotkeys";

interface Combination {
  hotkeys: string | string[];
  callback: (event?: KeyboardEvent, combo?: string) => boolean | ExtendedKeyboardEvent;
  description: string;
}

@Injectable()
export class AbaplanHotkeysService {
  private hotkeys: {string: Hotkey | Hotkey[]};

  constructor(private _hotkeysService: HotkeysService) {}

  public addHotkeys(hotkeys: Combination[]) {
    hotkeys.forEach((hotkey) => this._hotkeysService.add(
      new Hotkey(hotkey.hotkeys, hotkey.callback, undefined, hotkey.description),
    ));
  }
}
