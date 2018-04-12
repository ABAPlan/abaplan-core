import { Injectable } from "@angular/core";
import { ArtyomProvider, VoiceProvider } from "./artyomProvider";

@Injectable()
export class VoiceService {
  private voiceProvider: VoiceProvider = new ArtyomProvider();

  /** Text-to-speech in the current lang */
  public say(text: string) {
    if (process.env.NODE_ENV !== "production") {
      // tslint:disable-next-line no-console
      console.log("Saying: ", text);
    }
    this.voiceProvider.say(text);
  }

  /** Text-to-speech an adress in the current lang */
  public sayGeocodeResult(result: /*google.maps.GeocoderResult*/ any) {
    const address =
      result.address_components[0].long_name +
      " " +
      result.address_components[1].long_name;
    this.say(address);
  }

  /** Add a triger and action for the voice recognition */
  public addCommand(
    indexes: string[],
    description: string,
    action: (i: number, wildcard?: string) => void,
  ): void {
    this.voiceProvider.addCommand(indexes, description, action);
  }

  /** Change Current Lang of the Speaker */
  public changeLang(lang: string): void {
    this.voiceProvider.changeLang(lang);
  }

  /** Simulation a voice recognition */
  public simulate(s: string): void {
    if (process.env.NODE_ENV !== "production") {
      // tslint:disable-next-line no-console
      console.log("Receive: ", s);
    }
    this.voiceProvider.simulate(s);
  }

  public initialization(): void {
    this.voiceProvider.initialization();
  }
}
