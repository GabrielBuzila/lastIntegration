import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrderDetails } from '../order-details.model';
import { OrderDetailsService } from '../service/order-details.service';
import { OrderDetailsDeleteDialogComponent } from '../delete/order-details-delete-dialog.component';

@Component({
  selector: 'jhi-order-details',
  templateUrl: './order-details.component.html',
})
export class OrderDetailsComponent implements OnInit {
  orderDetails?: IOrderDetails[];
  isLoading = false;

  constructor(protected orderDetailsService: OrderDetailsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.orderDetailsService.query().subscribe({
      next: (res: HttpResponse<IOrderDetails[]>) => {
        this.isLoading = false;
        this.orderDetails = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IOrderDetails): number {
    return item.id!;
  }

  delete(orderDetails: IOrderDetails): void {
    const modalRef = this.modalService.open(OrderDetailsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.orderDetails = orderDetails;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
