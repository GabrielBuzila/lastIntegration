import { ISupplier } from 'app/entities/supplier/supplier.model';
import { ICategory } from 'app/entities/category/category.model';
import { IOrderDetails } from 'app/entities/order-details/order-details.model';

export interface IProduct {
  id?: number;
  productName?: string | null;
  unit?: number | null;
  price?: number | null;
  supplier?: ISupplier | null;
  category?: ICategory | null;
  orderDetails?: IOrderDetails | null;
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public productName?: string | null,
    public unit?: number | null,
    public price?: number | null,
    public supplier?: ISupplier | null,
    public category?: ICategory | null,
    public orderDetails?: IOrderDetails | null
  ) {}
}

export function getProductIdentifier(product: IProduct): number | undefined {
  return product.id;
}
