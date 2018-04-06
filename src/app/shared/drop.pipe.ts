import { Pipe, PipeTransform } from "@angular/core";
import * as _ from "lodash";

@Pipe({name: "drop"})
export class DropPipe implements PipeTransform {
  public transform(collection: any[], n: number): any[] {
    return _.drop(collection, n);
  }
}
