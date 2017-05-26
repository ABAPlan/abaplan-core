import {Injectable} from "@angular/core";
import * as br from 'braille';

@Injectable()
export class PrintService {

  private readonly style: string = `
    @page {
        size: landscape;
        margin: 0mm;}

    .container {
        margin: 0;
        width: auto;
        padding: 0;
    }
    
    .col-md-12 {
        padding-left:0px; 
    }

    /* jca: hack to remove margin due to the map scale */
    .row.map {
        margin-bottom: -1%;
    }

    #map{
        border-style:solid;
        overflow: hidden;

        /* jca: Update to fix the ratio and margin problem, issue #73 */
        /*width: 1054px;*/
        width: 1060px;
        /*height: 716px;*/
        height: 722px;
        display:block;
        margin: 0 auto 0 auto;
        transform: scale(0.95);
    }

    .textRow{
        margin:0 auto;
        margin-left: 6%;
        margin-right:6%;
    }

    .braille{
        font-weight: bold;
        font-size: 220%;
        letter-spacing: 6%;
    }

    .text{
        font-size: 150%;
    }

    #brailleR, #textR{
        float:right;
    }

    #brailleL, #textL{
        float:left;
    }

   `;

  printMap(map: string, title?: string, link?: string):void{

    const mywindow = window.open('', '', '');
    if (title === undefined){
      title = "Sans titre";
    }
    if (link === undefined){
      link = "";
    }
    const page : string = this.buildHTMLPage(map,title,link);

    mywindow.document.write(page);
    mywindow.document.close();

  }

  public buildHTMLPage(map: string, title: string, link: string):string {
    let bTitle : string = br.toBraille(title);
    let bLink : string = br.toBraille(link);
    let page :string = `
    <html>
      <head>
        <title>${title}</title>
        <!-- <link href="node_modules/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet"> -->
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
        <!-- <link rel="stylesheet" type="text/css" href="src/app/core/print-map.service.css"  /> -->
        <style>
            ${this.style}
        </style>
      </head>
      <body onload="window.print();window.close()">
      <div class="container">
			    <div class="row map">
			    <div id="map" >
            <div class="col-md-12">
              ${map}
            </div>
			    </div>
			    </div>
          <div class="row textRow">
            <div id="textL" class="text">
              ${title}
            </div>
            <div id="textR" class="text">
              ${link}
            </div>
			    </div>
          <div class="row textRow">
            <div id="brailleL" class="braille">
              ${bTitle}
            </div>
            <div id="brailleR" class="braille">
              ${bLink}
            </div>
          </div>
      </div>
      </body>
    </html>`;
    return page;
  }

}
