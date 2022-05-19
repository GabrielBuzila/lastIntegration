import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IOrder, Order } from '../order.model';
import { OrderService } from '../service/order.service';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';
import { IShipper } from 'app/entities/shipper/shipper.model';
import { ShipperService } from 'app/entities/shipper/service/shipper.service';

@Component({
  selector: 'jhi-order-update',
  templateUrl: './order-update.component.html',
})
export class OrderUpdateComponent implements OnInit {
  isSaving = false;

  customersSharedCollection: ICustomer[] = [];
  employeesSharedCollection: IEmployee[] = [];
  shippersSharedCollection: IShipper[] = [];

  editForm = this.fb.group({
    id: [],
    orderDate: [],
    customer: [],
    employee: [],
    shipper: [],
  });

  constructor(
    protected orderService: OrderService,
    protected customerService: CustomerService,
    protected employeeService: EmployeeService,
    protected shipperService: ShipperService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ order }) => {
      this.updateForm(order);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const order = this.createFromForm();
    if (order.id !== undefined) {
      this.subscribeToSaveResponse(this.orderService.update(order));
    } else {
      this.subscribeToSaveResponse(this.orderService.create(order));
    }
  }

  trackCustomerById(_index: number, item: ICustomer): number {
    return item.id!;
  }

  trackEmployeeById(_index: number, item: IEmployee): number {
    return item.id!;
  }

  trackShipperById(_index: number, item: IShipper): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrder>>): void {
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

  protected updateForm(order: IOrder): void {
    this.editForm.patchValue({
      id: order.id,
      orderDate: order.orderDate,
      customer: order.customer,
      employee: order.employee,
      shipper: order.shipper,
    });

    this.customersSharedCollection = this.customerService.addCustomerToCollectionIfMissing(this.customersSharedCollection, order.customer);
    this.employeesSharedCollection = this.employeeService.addEmployeeToCollectionIfMissing(this.employeesSharedCollection, order.employee);
    this.shippersSharedCollection = this.shipperService.addShipperToCollectionIfMissing(this.shippersSharedCollection, order.shipper);
  }

  protected loadRelationshipsOptions(): void {
    this.customerService
      .query()
      .pipe(map((res: HttpResponse<ICustomer[]>) => res.body ?? []))
      .pipe(
        map((customers: ICustomer[]) =>
          this.customerService.addCustomerToCollectionIfMissing(customers, this.editForm.get('customer')!.value)
        )
      )
      .subscribe((customers: ICustomer[]) => (this.customersSharedCollection = customers));

    this.employeeService
      .query()
      .pipe(map((res: HttpResponse<IEmployee[]>) => res.body ?? []))
      .pipe(
        map((employees: IEmployee[]) =>
          this.employeeService.addEmployeeToCollectionIfMissing(employees, this.editForm.get('employee')!.value)
        )
      )
      .subscribe((employees: IEmployee[]) => (this.employeesSharedCollection = employees));

    this.shipperService
      .query()
      .pipe(map((res: HttpResponse<IShipper[]>) => res.body ?? []))
      .pipe(
        map((shippers: IShipper[]) => this.shipperService.addShipperToCollectionIfMissing(shippers, this.editForm.get('shipper')!.value))
      )
      .subscribe((shippers: IShipper[]) => (this.shippersSharedCollection = shippers));
  }

  protected createFromForm(): IOrder {
    return {
      ...new Order(),
      id: this.editForm.get(['id'])!.value,
      orderDate: this.editForm.get(['orderDate'])!.value,
      customer: this.editForm.get(['customer'])!.value,
      employee: this.editForm.get(['employee'])!.value,
      shipper: this.editForm.get(['shipper'])!.value,
    };
  }
}
