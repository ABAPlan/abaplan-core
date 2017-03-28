import { Injectable } from '@angular/core';
import artyomjs = require('artyom.js');
import ArtyomCommand = Artyom.ArtyomCommand;
import * as _ from "lodash";

@Injectable()
export class VoiceService {

  private voiceProvider: IVoiceProvider = new ArtyomProvider();

  constructor() { }

  public say(text: string) {
    console.log("Saying: ", text);
    this.voiceProvider.say(text);
  }

  public sayGeocodeResult(result : /*google.maps.GeocoderResult*/any) {
    const address = result.address_components[0].long_name + ' '+
                    result.address_components[1].long_name;
    this.say(address);
  }

  public addCommand(indexes: string[], description: string, action: (i: number, wildcard?: string) => void ): void {
    this.voiceProvider.addCommand(indexes, description, action);
  }
}


interface IVoiceProvider {
  say(text: string): void;
  addCommand(indexes: string[], description: string, action: (i: number, wildcard?: string) => void );
}

class ArtyomProvider implements IVoiceProvider {

  readonly artyom = artyomjs.ArtyomBuilder.getInstance();

  constructor() {
    this.artyom.initialize({
      lang: "fr-FR", // GreatBritain english
      continuous: false, // Listen forever
      soundex: true,// Use the soundex algorithm to increase accuracy
      debug: true, // Show messages in the console
      listen: false // Start to listen commands !
    });
  }

  public say(text: string): void {
    this.artyom.say(text);
  }

  public addCommand(indexes: string[], description: string, action: (i: number, wildcard?: string) => void ): void {
    const isSmart = _.some(indexes, str => _.includes(str, "*"));
    const command: ArtyomCommand = <ArtyomCommand> { indexes: indexes, action: action, description: description, smart: isSmart};
    this.artyom.addCommands(command);
  }
}