import { Pipe, PipeTransform } from "@angular/core";
import * as _ from "lodash";

@Pipe({name: "take"})
export class TakePipe implements PipeTransform {
  public transform(collection: any[], n: number): any[] {
    return _.take(collection, n);
  }
}
