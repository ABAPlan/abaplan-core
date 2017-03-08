import { OptionMap } from './map';
import { MapService }   from './map.service';

import {HttpModule} from '@angular/http';

import { inject, async, TestBed} from '@angular/core/testing';
import 'rxjs/add/operator/map';

describe('MapService', () => {
  // Before each, import module and providers
  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
    TestBed.configureTestingModule({
        imports: [HttpModule],
        providers: [MapService]
      }
    );
  });

  it('should get map #2', async(done) =>
    inject([MapService], (service: MapService) => {
      return service.defaultMap().subscribe(
        (map : OptionMap) => {
          console.log(map);
          expect(map).toBeDefined();
          done();
        },
        (error) => {
          console.log("------------------------------------------------");
          fail(error);
          done();
        });

    })()
  );

  it('should get maps', async(done) =>
    inject([MapService], (service: MapService) => {
      // Return promise
      return service.maps().toPromise().then(
        // Pass
        (maps : OptionMap[]) => {
          console.log(maps);
          expect(maps).toBeDefined();
          expect(maps.length).toBeGreaterThan(1);
          done();
        },
        // Fail
        (error) => {
          console.log("+-----------------------------------------------");
          fail(error);
          done();
        });
    })()
  );

});
