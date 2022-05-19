export interface IShipper {
  id?: number;
  shipperName?: string | null;
  phone?: string | null;
}

export class Shipper implements IShipper {
  constructor(public id?: number, public shipperName?: string | null, public phone?: string | null) {}
}

export function getShipperIdentifier(shipper: IShipper): number | undefined {
  return shipper.id;
}
