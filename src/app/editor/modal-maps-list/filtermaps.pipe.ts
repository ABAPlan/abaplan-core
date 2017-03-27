import { Pipe, PipeTransform } from '@angular/core';
import { OptionMap } from "../../map/map";


@Pipe({name: 'filterMaps'})
export class FilterMapsPipe implements PipeTransform {
  transform(maps: OptionMap[], query: string, activePage: number): OptionMap[] {
    const filteredMaps = maps
      .filter(
        m => {
          if (m.title === undefined){
            m.title = "";
          }
          if (m.uid === undefined){
            m.uid = -1;
          }
          return m.title.toLowerCase().includes(query.toLowerCase()) || m.uid.toString().includes(query);
        }
      );

    return filteredMaps;
  }
}
