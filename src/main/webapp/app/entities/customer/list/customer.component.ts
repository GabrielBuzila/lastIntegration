import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICustomer } from '../customer.model';
import { CustomerService } from '../service/customer.service';
import { CustomerDeleteDialogComponent } from '../delete/customer-delete-dialog.component';

@Component({
  selector: 'jhi-customer',
  templateUrl: './customer.component.html',
})
export class CustomerComponent implements OnInit {
  customers?: ICustomer[];
  isLoading = false;

  constructor(protected customerService: CustomerService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.customerService.query().subscribe({
      next: (res: HttpResponse<ICustomer[]>) => {
        this.isLoading = false;
        this.customers = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ICustomer): number {
    return item.id!;
  }

  delete(customer: ICustomer): void {
    const modalRef = this.modalService.open(CustomerDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.customer = customer;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
