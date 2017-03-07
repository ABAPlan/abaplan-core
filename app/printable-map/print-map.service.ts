import {Injectable} from "@angular/core";
import { PrintMapComponent } from "./print-map.component";
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class PrintService {
  private missionSource = new Subject<[string,string,string]>();

  missionSource$ = this.missionSource.asObservable();

  mission(mission1: string,mission2: string,mission3: string) {
    this.missionSource.next([mission1,mission2,mission3]);
  }
}
