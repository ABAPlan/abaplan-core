import { NgModule }           from '@angular/core';

import { CommonModule } from '@angular/common';

import { MapService }       from '../core/map.service';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ ],
  providers:    [ MapService ]
})
export class CityMapModule { }