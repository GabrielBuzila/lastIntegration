import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISupplier } from '../supplier.model';
import { SupplierService } from '../service/supplier.service';
import { SupplierDeleteDialogComponent } from '../delete/supplier-delete-dialog.component';

@Component({
  selector: 'jhi-supplier',
  templateUrl: './supplier.component.html',
})
export class SupplierComponent implements OnInit {
  suppliers?: ISupplier[];
  isLoading = false;

  constructor(protected supplierService: SupplierService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.supplierService.query().subscribe({
      next: (res: HttpResponse<ISupplier[]>) => {
        this.isLoading = false;
        this.suppliers = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ISupplier): number {
    return item.id!;
  }

  delete(supplier: ISupplier): void {
    const modalRef = this.modalService.open(SupplierDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.supplier = supplier;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
