import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IShipper, Shipper } from '../shipper.model';
import { ShipperService } from '../service/shipper.service';

@Component({
  selector: 'jhi-shipper-update',
  templateUrl: './shipper-update.component.html',
})
export class ShipperUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    shipperName: [],
    phone: [],
  });

  constructor(protected shipperService: ShipperService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shipper }) => {
      this.updateForm(shipper);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const shipper = this.createFromForm();
    if (shipper.id !== undefined) {
      this.subscribeToSaveResponse(this.shipperService.update(shipper));
    } else {
      this.subscribeToSaveResponse(this.shipperService.create(shipper));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IShipper>>): void {
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

  protected updateForm(shipper: IShipper): void {
    this.editForm.patchValue({
      id: shipper.id,
      shipperName: shipper.shipperName,
      phone: shipper.phone,
    });
  }

  protected createFromForm(): IShipper {
    return {
      ...new Shipper(),
      id: this.editForm.get(['id'])!.value,
      shipperName: this.editForm.get(['shipperName'])!.value,
      phone: this.editForm.get(['phone'])!.value,
    };
  }
}
