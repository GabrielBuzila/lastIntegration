import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISupplier, getSupplierIdentifier } from '../supplier.model';

export type EntityResponseType = HttpResponse<ISupplier>;
export type EntityArrayResponseType = HttpResponse<ISupplier[]>;

@Injectable({ providedIn: 'root' })
export class SupplierService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/suppliers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(supplier: ISupplier): Observable<EntityResponseType> {
    return this.http.post<ISupplier>(this.resourceUrl, supplier, { observe: 'response' });
  }

  update(supplier: ISupplier): Observable<EntityResponseType> {
    return this.http.put<ISupplier>(`${this.resourceUrl}/${getSupplierIdentifier(supplier) as number}`, supplier, { observe: 'response' });
  }

  partialUpdate(supplier: ISupplier): Observable<EntityResponseType> {
    return this.http.patch<ISupplier>(`${this.resourceUrl}/${getSupplierIdentifier(supplier) as number}`, supplier, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISupplier>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISupplier[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSupplierToCollectionIfMissing(supplierCollection: ISupplier[], ...suppliersToCheck: (ISupplier | null | undefined)[]): ISupplier[] {
    const suppliers: ISupplier[] = suppliersToCheck.filter(isPresent);
    if (suppliers.length > 0) {
      const supplierCollectionIdentifiers = supplierCollection.map(supplierItem => getSupplierIdentifier(supplierItem)!);
      const suppliersToAdd = suppliers.filter(supplierItem => {
        const supplierIdentifier = getSupplierIdentifier(supplierItem);
        if (supplierIdentifier == null || supplierCollectionIdentifiers.includes(supplierIdentifier)) {
          return false;
        }
        supplierCollectionIdentifiers.push(supplierIdentifier);
        return true;
      });
      return [...suppliersToAdd, ...supplierCollection];
    }
    return supplierCollection;
  }
}
