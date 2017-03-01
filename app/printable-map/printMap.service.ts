import {Injectable} from "@angular/core";
import {PrintMapComponent} from "./PrintMap.component";

@Injectable()
export class PrintService {
  map:string;
  title:string;
  link:string;
}
