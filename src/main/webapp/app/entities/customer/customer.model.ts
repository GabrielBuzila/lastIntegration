export interface ICustomer {
  id?: number;
  customerName?: string | null;
  contactName?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
}

export class Customer implements ICustomer {
  constructor(
    public id?: number,
    public customerName?: string | null,
    public contactName?: string | null,
    public address?: string | null,
    public city?: string | null,
    public postalCode?: string | null,
    public country?: string | null
  ) {}
}

export function getCustomerIdentifier(customer: ICustomer): number | undefined {
  return customer.id;
}
