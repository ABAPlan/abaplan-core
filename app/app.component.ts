import { Component } from '@angular/core';
import { PrintService } from "./printable-map/printMap.service";
@Component({
  selector: 'aba-plan',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  providers: [PrintService]

})
export class AppComponent {
  constructor() { }
}
