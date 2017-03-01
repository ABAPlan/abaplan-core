import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrintService } from "./printMap.service";

@Component({
  selector: 'map-print',
  template: `<html>
    <head>
      <title></title>
      <link href="node_modules/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
      <link rel="stylesheet" type="text/css" href="app/printable-map/print.css"  />
    </head>
    <body onload="window.print();window.close()">
      <div onload="window.print();window.close()">
        <div class="row" id="map" >
            <div class="col-md-12">
              {{map}}
            </div>
        </div>
        <div class="row" id="textRow">
           <div class="col-md-12">

             <div id="cont">
               <div id="textL">
                 {{title}}
               </div>
              </div>
              <div id="cont">
                <div id="textR">
                  {{link}}
                </div>
               </div>
            </div>
            <br>
            <div class="col-md-12">
              <div id="cont">
                <div id="brailleL">
                  {{bTitle}}
                </div>
               </div>
               <div id="cont">
                 <div id="brailleR">
                   {{bLink}}
                 </div>
                </div>
             </div>

          </div>
        </div>
     </body>
  </html>`
})
export class PrintMapComponent {
  constructor(private printService: PrintService) {}

  ngOnInit() {
  //  console.log(this.route.params.value.id);
  //,private printService: PrintService  console.log(this.printService);
  console.log(this.printService.title);
  }
}
