import { Injectable } from '@angular/core';
import artyomjs = require('artyom.js');


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
}


interface IVoiceProvider {
  say(text: string): void;
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
}