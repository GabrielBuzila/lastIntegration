import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IOrderDetails, OrderDetails } from '../order-details.model';
import { OrderDetailsService } from '../service/order-details.service';
import { IOrder } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';

@Component({
  selector: 'jhi-order-details-update',
  templateUrl: './order-details-update.component.html',
})
export class OrderDetailsUpdateComponent implements OnInit {
  isSaving = false;

  ordersCollection: IOrder[] = [];

  editForm = this.fb.group({
    id: [],
    quantity: [],
    order: [],
  });

  constructor(
    protected orderDetailsService: OrderDetailsService,
    protected orderService: OrderService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ orderDetails }) => {
      this.updateForm(orderDetails);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const orderDetails = this.createFromForm();
    if (orderDetails.id !== undefined) {
      this.subscribeToSaveResponse(this.orderDetailsService.update(orderDetails));
    } else {
      this.subscribeToSaveResponse(this.orderDetailsService.create(orderDetails));
    }
  }

  trackOrderById(_index: number, item: IOrder): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrderDetails>>): void {
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

  protected updateForm(orderDetails: IOrderDetails): void {
    this.editForm.patchValue({
      id: orderDetails.id,
      quantity: orderDetails.quantity,
      order: orderDetails.order,
    });

    this.ordersCollection = this.orderService.addOrderToCollectionIfMissing(this.ordersCollection, orderDetails.order);
  }

  protected loadRelationshipsOptions(): void {
    this.orderService
      .query({ filter: 'orderdetails-is-null' })
      .pipe(map((res: HttpResponse<IOrder[]>) => res.body ?? []))
      .pipe(map((orders: IOrder[]) => this.orderService.addOrderToCollectionIfMissing(orders, this.editForm.get('order')!.value)))
      .subscribe((orders: IOrder[]) => (this.ordersCollection = orders));
  }

  protected createFromForm(): IOrderDetails {
    return {
      ...new OrderDetails(),
      id: this.editForm.get(['id'])!.value,
      quantity: this.editForm.get(['quantity'])!.value,
      order: this.editForm.get(['order'])!.value,
    };
  }
}
