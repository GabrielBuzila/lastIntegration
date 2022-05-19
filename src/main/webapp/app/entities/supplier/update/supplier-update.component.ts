import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ISupplier, Supplier } from '../supplier.model';
import { SupplierService } from '../service/supplier.service';

@Component({
  selector: 'jhi-supplier-update',
  templateUrl: './supplier-update.component.html',
})
export class SupplierUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    supplierName: [],
    contactName: [],
    address: [],
    city: [],
    postalCode: [],
    country: [],
    phone: [],
  });

  constructor(protected supplierService: SupplierService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ supplier }) => {
      this.updateForm(supplier);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const supplier = this.createFromForm();
    if (supplier.id !== undefined) {
      this.subscribeToSaveResponse(this.supplierService.update(supplier));
    } else {
      this.subscribeToSaveResponse(this.supplierService.create(supplier));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISupplier>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(supplier: ISupplier): void {
    this.editForm.patchValue({
      id: supplier.id,
      supplierName: supplier.supplierName,
      contactName: supplier.contactName,
      address: supplier.address,
      city: supplier.city,
      postalCode: supplier.postalCode,
      country: supplier.country,
      phone: supplier.phone,
    });
  }

  protected createFromForm(): ISupplier {
    return {
      ...new Supplier(),
      id: this.editForm.get(['id'])!.value,
      supplierName: this.editForm.get(['supplierName'])!.value,
      contactName: this.editForm.get(['contactName'])!.value,
      address: this.editForm.get(['address'])!.value,
      city: this.editForm.get(['city'])!.value,
      postalCode: this.editForm.get(['postalCode'])!.value,
      country: this.editForm.get(['country'])!.value,
      phone: this.editForm.get(['phone'])!.value,
    };
  }
}
