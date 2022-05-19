import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IShipper } from '../shipper.model';
import { ShipperService } from '../service/shipper.service';
import { ShipperDeleteDialogComponent } from '../delete/shipper-delete-dialog.component';

@Component({
  selector: 'jhi-shipper',
  templateUrl: './shipper.component.html',
})
export class ShipperComponent implements OnInit {
  shippers?: IShipper[];
  isLoading = false;

  constructor(protected shipperService: ShipperService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.shipperService.query().subscribe({
      next: (res: HttpResponse<IShipper[]>) => {
        this.isLoading = false;
        this.shippers = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IShipper): number {
    return item.id!;
  }

  delete(shipper: IShipper): void {
    const modalRef = this.modalService.open(ShipperDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.shipper = shipper;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
