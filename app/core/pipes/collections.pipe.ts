import { Pipe, PipeTransform } from '@angular/core';
import * as _ from "lodash";

@Pipe({name: 'length'})
export class LengthPipe implements PipeTransform {
  transform(collection: any[]): number {
    return collection.length;
  }
}

@Pipe({name: 'drop'})
export class DropPipe implements PipeTransform {
  transform(collection: any[], n: number): any[] {
    return _.drop(collection, n);
  }
}

@Pipe({name: 'take'})
export class TakePipe implements PipeTransform {
  transform(collection: any[], n: number): any[] {
    return _.take(collection, n);
  }
}
