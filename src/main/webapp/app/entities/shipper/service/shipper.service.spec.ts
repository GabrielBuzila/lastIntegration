import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IShipper, Shipper } from '../shipper.model';

import { ShipperService } from './shipper.service';

describe('Shipper Service', () => {
  let service: ShipperService;
  let httpMock: HttpTestingController;
  let elemDefault: IShipper;
  let expectedResult: IShipper | IShipper[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ShipperService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      shipperName: 'AAAAAAA',
      phone: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Shipper', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Shipper()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Shipper', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          shipperName: 'BBBBBB',
          phone: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Shipper', () => {
      const patchObject = Object.assign(
        {
          shipperName: 'BBBBBB',
          phone: 'BBBBBB',
        },
        new Shipper()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Shipper', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          shipperName: 'BBBBBB',
          phone: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Shipper', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addShipperToCollectionIfMissing', () => {
      it('should add a Shipper to an empty array', () => {
        const shipper: IShipper = { id: 123 };
        expectedResult = service.addShipperToCollectionIfMissing([], shipper);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shipper);
      });

      it('should not add a Shipper to an array that contains it', () => {
        const shipper: IShipper = { id: 123 };
        const shipperCollection: IShipper[] = [
          {
            ...shipper,
          },
          { id: 456 },
        ];
        expectedResult = service.addShipperToCollectionIfMissing(shipperCollection, shipper);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Shipper to an array that doesn't contain it", () => {
        const shipper: IShipper = { id: 123 };
        const shipperCollection: IShipper[] = [{ id: 456 }];
        expectedResult = service.addShipperToCollectionIfMissing(shipperCollection, shipper);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shipper);
      });

      it('should add only unique Shipper to an array', () => {
        const shipperArray: IShipper[] = [{ id: 123 }, { id: 456 }, { id: 89321 }];
        const shipperCollection: IShipper[] = [{ id: 123 }];
        expectedResult = service.addShipperToCollectionIfMissing(shipperCollection, ...shipperArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const shipper: IShipper = { id: 123 };
        const shipper2: IShipper = { id: 456 };
        expectedResult = service.addShipperToCollectionIfMissing([], shipper, shipper2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shipper);
        expect(expectedResult).toContain(shipper2);
      });

      it('should accept null and undefined values', () => {
        const shipper: IShipper = { id: 123 };
        expectedResult = service.addShipperToCollectionIfMissing([], null, shipper, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shipper);
      });

      it('should return initial array if no Shipper is added', () => {
        const shipperCollection: IShipper[] = [{ id: 123 }];
        expectedResult = service.addShipperToCollectionIfMissing(shipperCollection, undefined, null);
        expect(expectedResult).toEqual(shipperCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
