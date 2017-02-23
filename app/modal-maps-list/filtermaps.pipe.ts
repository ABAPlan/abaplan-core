import { Pipe, PipeTransform } from '@angular/core';
import { OptionMap } from "../core/map";


@Pipe({name: 'filterMaps'})
export class FilterMapsPipe implements PipeTransform {
  transform(maps: OptionMap[], query: string, activePage: number): OptionMap[] {
    const filteredMaps = maps
      .filter(
        m => m.title.toLowerCase().includes(query.toLowerCase()) || m.uid.toString().includes(query)
      );

    return filteredMaps;
  }
}
