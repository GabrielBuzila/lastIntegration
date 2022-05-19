import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ShipperComponent } from '../list/shipper.component';
import { ShipperDetailComponent } from '../detail/shipper-detail.component';
import { ShipperUpdateComponent } from '../update/shipper-update.component';
import { ShipperRoutingResolveService } from './shipper-routing-resolve.service';

const shipperRoute: Routes = [
  {
    path: '',
    component: ShipperComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ShipperDetailComponent,
    resolve: {
      shipper: ShipperRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ShipperUpdateComponent,
    resolve: {
      shipper: ShipperRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ShipperUpdateComponent,
    resolve: {
      shipper: ShipperRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(shipperRoute)],
  exports: [RouterModule],
})
export class ShipperRoutingModule {}
