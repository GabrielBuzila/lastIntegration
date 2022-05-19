export interface ISupplier {
  id?: number;
  supplierName?: string | null;
  contactName?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
  phone?: string | null;
}

export class Supplier implements ISupplier {
  constructor(
    public id?: number,
    public supplierName?: string | null,
    public contactName?: string | null,
    public address?: string | null,
    public city?: string | null,
    public postalCode?: string | null,
    public country?: string | null,
    public phone?: string | null
  ) {}
}

export function getSupplierIdentifier(supplier: ISupplier): number | undefined {
  return supplier.id;
}
