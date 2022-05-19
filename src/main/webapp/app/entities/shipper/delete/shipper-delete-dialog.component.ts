import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IShipper } from '../shipper.model';
import { ShipperService } from '../service/shipper.service';

@Component({
  templateUrl: './shipper-delete-dialog.component.html',
})
export class ShipperDeleteDialogComponent {
  shipper?: IShipper;

  constructor(protected shipperService: ShipperService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.shipperService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
