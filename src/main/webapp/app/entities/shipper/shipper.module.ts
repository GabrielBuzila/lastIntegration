import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ShipperComponent } from './list/shipper.component';
import { ShipperDetailComponent } from './detail/shipper-detail.component';
import { ShipperUpdateComponent } from './update/shipper-update.component';
import { ShipperDeleteDialogComponent } from './delete/shipper-delete-dialog.component';
import { ShipperRoutingModule } from './route/shipper-routing.module';

@NgModule({
  imports: [SharedModule, ShipperRoutingModule],
  declarations: [ShipperComponent, ShipperDetailComponent, ShipperUpdateComponent, ShipperDeleteDialogComponent],
  entryComponents: [ShipperDeleteDialogComponent],
})
export class ShipperModule {}
