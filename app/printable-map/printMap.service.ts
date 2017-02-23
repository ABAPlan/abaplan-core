import {Injectable} from "@angular/core";

@Injectable()
export class PrintService {

  printMap(title : string ,link : string , map : string):void{
    let mywindow = window.open('', '', '');

    let page : string = this.buildHTMLPage(map,title,link);
    
    mywindow.document.write(page);
    mywindow.document.close();
  }

  public buildHTMLPage(map: string, title: string, link: string):string {
    var br = require('braille');
    var bTitle = br.toBraille(title);
    var bLink = br.toBraille(link);
    var page :string = `
    <html>
      <head>
        <title></title>
        <link href="node_modules/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="app/print.css"  />
      </head>
      <body onload="window.print();window.close()">
        <div>
          <div class="row" id="map" >
              <div class="col-md-12">
                ${map}
              </div>
          </div>
          <div class="row" id="textRow">
             <div class="col-md-12">

               <div id="cont">
                 <div id="textL">
                   ${title}
                 </div>
                </div>

                <div id="cont">
                  <div id="textR">
                    ${link}
                  </div>
                 </div>

              </div>
              <br>
              <div class="col-md-12">

                <div id="cont">
                  <div id="brailleL">
                    ${bTitle}
                  </div>
                 </div>

                 <div id="cont">
                   <div id="brailleR">
                     ${bLink}
                   </div>
                  </div>

               </div>

            </div>
          </div>
       </body>
    </html>`;
    return page;
  }

}
