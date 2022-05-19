import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IShipper, getShipperIdentifier } from '../shipper.model';

export type EntityResponseType = HttpResponse<IShipper>;
export type EntityArrayResponseType = HttpResponse<IShipper[]>;

@Injectable({ providedIn: 'root' })
export class ShipperService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/shippers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(shipper: IShipper): Observable<EntityResponseType> {
    return this.http.post<IShipper>(this.resourceUrl, shipper, { observe: 'response' });
  }

  update(shipper: IShipper): Observable<EntityResponseType> {
    return this.http.put<IShipper>(`${this.resourceUrl}/${getShipperIdentifier(shipper) as number}`, shipper, { observe: 'response' });
  }

  partialUpdate(shipper: IShipper): Observable<EntityResponseType> {
    return this.http.patch<IShipper>(`${this.resourceUrl}/${getShipperIdentifier(shipper) as number}`, shipper, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IShipper>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IShipper[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addShipperToCollectionIfMissing(shipperCollection: IShipper[], ...shippersToCheck: (IShipper | null | undefined)[]): IShipper[] {
    const shippers: IShipper[] = shippersToCheck.filter(isPresent);
    if (shippers.length > 0) {
      const shipperCollectionIdentifiers = shipperCollection.map(shipperItem => getShipperIdentifier(shipperItem)!);
      const shippersToAdd = shippers.filter(shipperItem => {
        const shipperIdentifier = getShipperIdentifier(shipperItem);
        if (shipperIdentifier == null || shipperCollectionIdentifiers.includes(shipperIdentifier)) {
          return false;
        }
        shipperCollectionIdentifiers.push(shipperIdentifier);
        return true;
      });
      return [...shippersToAdd, ...shipperCollection];
    }
    return shipperCollection;
  }
}
