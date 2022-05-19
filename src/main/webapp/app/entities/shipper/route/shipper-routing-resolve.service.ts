import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IShipper, Shipper } from '../shipper.model';
import { ShipperService } from '../service/shipper.service';

@Injectable({ providedIn: 'root' })
export class ShipperRoutingResolveService implements Resolve<IShipper> {
  constructor(protected service: ShipperService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IShipper> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((shipper: HttpResponse<Shipper>) => {
          if (shipper.body) {
            return of(shipper.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Shipper());
  }
}
