import { Injectable } from '@angular/core';
import artyomjs = require('artyom.js');

const artyom = artyomjs.ArtyomBuilder.getInstance();

@Injectable()
export class VoiceService {
  constructor() {
    // Get an unique ArtyomJS instance
    artyom.initialize({
        lang: "fr-FR", // GreatBritain english
        continuous: false, // Listen forever
        soundex: true,// Use the soundex algorithm to increase accuracy
        debug: true, // Show messages in the console
        listen: true // Start to listen commands !
    });
  }

  public say(string : String) {
    console.log("Saying:"+string);
    artyom.say(string);
  }

  public sayGeocodeResult(result : /*google.maps.GeocoderResult*/any) {
    const address = result.address_components[0].long_name + ' '+
                    result.address_components[1].long_name;
    this.say(address);
  }
}