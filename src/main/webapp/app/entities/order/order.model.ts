import dayjs from 'dayjs/esm';
import { ICustomer } from 'app/entities/customer/customer.model';
import { IEmployee } from 'app/entities/employee/employee.model';
import { IShipper } from 'app/entities/shipper/shipper.model';

export interface IOrder {
  id?: number;
  orderDate?: dayjs.Dayjs | null;
  customer?: ICustomer | null;
  employee?: IEmployee | null;
  shipper?: IShipper | null;
}

export class Order implements IOrder {
  constructor(
    public id?: number,
    public orderDate?: dayjs.Dayjs | null,
    public customer?: ICustomer | null,
    public employee?: IEmployee | null,
    public shipper?: IShipper | null
  ) {}
}

export function getOrderIdentifier(order: IOrder): number | undefined {
  return order.id;
}
