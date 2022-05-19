import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IProduct, Product } from '../product.model';
import { ProductService } from '../service/product.service';
import { ISupplier } from 'app/entities/supplier/supplier.model';
import { SupplierService } from 'app/entities/supplier/service/supplier.service';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';
import { IOrderDetails } from 'app/entities/order-details/order-details.model';
import { OrderDetailsService } from 'app/entities/order-details/service/order-details.service';

@Component({
  selector: 'jhi-product-update',
  templateUrl: './product-update.component.html',
})
export class ProductUpdateComponent implements OnInit {
  isSaving = false;

  suppliersSharedCollection: ISupplier[] = [];
  categoriesSharedCollection: ICategory[] = [];
  orderDetailsSharedCollection: IOrderDetails[] = [];

  editForm = this.fb.group({
    id: [],
    productName: [],
    unit: [],
    price: [],
    supplier: [],
    category: [],
    orderDetails: [],
  });

  constructor(
    protected productService: ProductService,
    protected supplierService: SupplierService,
    protected categoryService: CategoryService,
    protected orderDetailsService: OrderDetailsService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ product }) => {
      this.updateForm(product);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const product = this.createFromForm();
    if (product.id !== undefined) {
      this.subscribeToSaveResponse(this.productService.update(product));
    } else {
      this.subscribeToSaveResponse(this.productService.create(product));
    }
  }

  trackSupplierById(_index: number, item: ISupplier): number {
    return item.id!;
  }

  trackCategoryById(_index: number, item: ICategory): number {
    return item.id!;
  }

  trackOrderDetailsById(_index: number, item: IOrderDetails): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduct>>): void {
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

  protected updateForm(product: IProduct): void {
    this.editForm.patchValue({
      id: product.id,
      productName: product.productName,
      unit: product.unit,
      price: product.price,
      supplier: product.supplier,
      category: product.category,
      orderDetails: product.orderDetails,
    });

    this.suppliersSharedCollection = this.supplierService.addSupplierToCollectionIfMissing(
      this.suppliersSharedCollection,
      product.supplier
    );
    this.categoriesSharedCollection = this.categoryService.addCategoryToCollectionIfMissing(
      this.categoriesSharedCollection,
      product.category
    );
    this.orderDetailsSharedCollection = this.orderDetailsService.addOrderDetailsToCollectionIfMissing(
      this.orderDetailsSharedCollection,
      product.orderDetails
    );
  }

  protected loadRelationshipsOptions(): void {
    this.supplierService
      .query()
      .pipe(map((res: HttpResponse<ISupplier[]>) => res.body ?? []))
      .pipe(
        map((suppliers: ISupplier[]) =>
          this.supplierService.addSupplierToCollectionIfMissing(suppliers, this.editForm.get('supplier')!.value)
        )
      )
      .subscribe((suppliers: ISupplier[]) => (this.suppliersSharedCollection = suppliers));

    this.categoryService
      .query()
      .pipe(map((res: HttpResponse<ICategory[]>) => res.body ?? []))
      .pipe(
        map((categories: ICategory[]) =>
          this.categoryService.addCategoryToCollectionIfMissing(categories, this.editForm.get('category')!.value)
        )
      )
      .subscribe((categories: ICategory[]) => (this.categoriesSharedCollection = categories));

    this.orderDetailsService
      .query()
      .pipe(map((res: HttpResponse<IOrderDetails[]>) => res.body ?? []))
      .pipe(
        map((orderDetails: IOrderDetails[]) =>
          this.orderDetailsService.addOrderDetailsToCollectionIfMissing(orderDetails, this.editForm.get('orderDetails')!.value)
        )
      )
      .subscribe((orderDetails: IOrderDetails[]) => (this.orderDetailsSharedCollection = orderDetails));
  }

  protected createFromForm(): IProduct {
    return {
      ...new Product(),
      id: this.editForm.get(['id'])!.value,
      productName: this.editForm.get(['productName'])!.value,
      unit: this.editForm.get(['unit'])!.value,
      price: this.editForm.get(['price'])!.value,
      supplier: this.editForm.get(['supplier'])!.value,
      category: this.editForm.get(['category'])!.value,
      orderDetails: this.editForm.get(['orderDetails'])!.value,
    };
  }
}
