import { Component } from "@angular/core";
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { MapService } from '../core/map.service';

@Component({
  selector: 'aba-touchpad',
  templateUrl: 'touchpad.component.html',
  styleUrls: ['touchpad.component.css']
})

export class TouchpadComponent {
  private id : number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: MapService
  ){ }

  ngOnInit() {
    // (+) converts string 'id' to a number
    let id = +this.route.snapshot.params['id'];
    this.id = id;
    //this.service.getHero(id)
    //  .then((hero: Hero) => this.hero = hero);
  }

}
