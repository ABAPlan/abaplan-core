import { Injectable } from '@angular/core';
import artyomjs = require('artyom.js');
import ArtyomCommand = artyomjs.ArtyomCommand;
import * as _ from "lodash";

@Injectable()
export class VoiceService {

  private voiceProvider: IVoiceProvider = new ArtyomProvider();

  constructor() { }

  /** Text-to-speech in the current lang */
  public say(text: string) {
    console.log("Saying: ", text);
    this.voiceProvider.say(text);
  }

  /** Text-to-speech an adress in the current lang */
  public sayGeocodeResult(result : /*google.maps.GeocoderResult*/any) {
    const address = result.address_components[0].long_name + ' '+
                    result.address_components[1].long_name;
    this.say(address);
  }

  /** Add a triger and action for the voice recognition*/
  public addCommand(indexes: string[], description: string, action: (i: number, wildcard?: string) => void ): void {
    this.voiceProvider.addCommand(indexes, description, action);
  }

  /** Change Current Lang of the Speaker */
  public changeLang(lang:string):void{
    this.voiceProvider.changeLang(lang);
  }

  /** Simulation a voice recognition */
  public simulate(s:string):void{
    console.log("Receive: ", s);
    this.voiceProvider.simulate(s);
  }

  public initialization():void{
    this.voiceProvider.initialization();
  }

}

interface IVoiceProvider {
  say(text: string): void;
  addCommand(indexes: string[], description: string, action: (i: number, wildcard?: string) => void );
  changeLang(lang:string);
  simulate(s:string);
  initialization();
}

class ArtyomProvider implements IVoiceProvider {

  readonly artyom = artyomjs.ArtyomBuilder.getInstance();
  private lang :string;

  constructor() {

  }

  /** Text-to-speech in the current lang */
  public say(text: string): void {
    this.artyom.say(text, {
            lang:this.lang
        });
  }

  /** Add a triger and action for the voice recognition*/
  public addCommand(indexes: string[], description: string, action: (i: number, wildcard?: string) => void ): void {
    const isSmart = _.some(indexes, str => _.includes(str, "*"));
    const command: ArtyomCommand = <ArtyomCommand> { indexes: indexes, action: action, description: description, smart: isSmart};
    this.artyom.addCommands(command);
  }

  public initialization(){
    this.artyom.initialize({
      lang: 'fr-FR',
      continuous: true,
      soundex: true,
      debug: true,
      listen: true
    });
    this.lang='fr-FR';
  }


  /** Change Current Lang of the Speaker */
  public changeLang(lang:string):void{
    this.lang=lang;
  }

  /** Simulation a voice recognition */
  public simulate(s:string):void{
    this.artyom.simulateInstruction(s);
  }


}
