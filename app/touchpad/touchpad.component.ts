import { Component } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { MapService } from '../core/map.service';
import {OptionMap, AbaMap } from '../core/map';

@Component({
  selector: 'aba-touchpad',
  templateUrl: 'touchpad.component.html',
  styleUrls: ['touchpad.component.css']
})

export class TouchpadComponent {
  private optionMap : OptionMap;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: MapService
  ){ }

  ngOnInit() {
    // (+) converts string 'id' to a number
    let id = +this.route.snapshot.params['id'];

    this.service.map(id)
     .subscribe((optionMap: OptionMap) => this.optionMap = optionMap);
  }

}
