import artyomjs from "artyom.js/source/artyom";

import * as _ from "lodash";

export interface VoiceProvider {
  say(text: string): void;
  addCommand(
    indexes: string[],
    description: string,
    action: (i: number, wildcard?: string) => void,
  );
  changeLang(lang: string);
  simulate(s: string);
  initialization();
}

export class ArtyomProvider implements VoiceProvider {
  private readonly artyom = new artyomjs();
  private lang: string;

  /** Text-to-speech in the current lang */
  public say(text: string): void {
    this.artyom.say(text, {
      lang: this.lang,
    });
  }

  /** Add a triger and action for the voice recognition */
  public addCommand(
    indexes: string[],
    description: string,
    action: (i: number, wildcard?: string) => void,
  ): void {
    const isSmart = _.some(indexes, (str) => _.includes(str, "*"));
    const command: ArtyomCommand = {
      action,
      description,
      indexes,
      smart: isSmart,
    } as ArtyomCommand;
    this.artyom.addCommands(command);
  }

  public initialization() {
    this.artyom.initialize({
      continuous: true,
      debug: true,
      lang: "fr-FR",
      listen: true,
      soundex: true,
    });
    this.lang = "fr-FR";
  }

  /** Change Current Lang of the Speaker */
  public changeLang(lang: string): void {
    this.lang = lang;
  }

  /** Simulation a voice recognition */
  public simulate(s: string): void {
    this.artyom.simulateInstruction(s);
  }
}
