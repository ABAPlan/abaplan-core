import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PrintService } from "./print-map.service";
import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'map-print',
  templateUrl: 'print-map.component.html',
  styleUrls: ['print-map.component.css']

})

export class PrintMapComponent {

  @Input() datas: [string,string,string];
  subscription: Subscription;
  data;


  constructor(private printService: PrintService) {
    this.subscription = printService.missionSource$.subscribe(
    mission => {
      this.data = mission;
  });
  console.log(this.data);
  }

  ngOnInit() {

  //  console.log(this.route.params.value.id);
  //,private printService: PrintService  console.log(this.printService);
  console.log(this.data);
  //console.log(this.printService);
  //console.log(this);
  }
}
