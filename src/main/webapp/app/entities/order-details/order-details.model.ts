import { IOrder } from 'app/entities/order/order.model';
import { IProduct } from 'app/entities/product/product.model';

export interface IOrderDetails {
  id?: number;
  quantity?: number | null;
  order?: IOrder | null;
  products?: IProduct[] | null;
}

export class OrderDetails implements IOrderDetails {
  constructor(public id?: number, public quantity?: number | null, public order?: IOrder | null, public products?: IProduct[] | null) {}
}

export function getOrderDetailsIdentifier(orderDetails: IOrderDetails): number | undefined {
  return orderDetails.id;
}
