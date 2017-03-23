import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'length'})
export class LengthPipe implements PipeTransform {
  transform(collection: any[]): number {
    return collection.length;
  }
}