import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OrderDetailsService } from '../service/order-details.service';
import { IOrderDetails, OrderDetails } from '../order-details.model';
import { IOrder } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';

import { OrderDetailsUpdateComponent } from './order-details-update.component';

describe('OrderDetails Management Update Component', () => {
  let comp: OrderDetailsUpdateComponent;
  let fixture: ComponentFixture<OrderDetailsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let orderDetailsService: OrderDetailsService;
  let orderService: OrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OrderDetailsUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(OrderDetailsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrderDetailsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    orderDetailsService = TestBed.inject(OrderDetailsService);
    orderService = TestBed.inject(OrderService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call order query and add missing value', () => {
      const orderDetails: IOrderDetails = { id: 456 };
      const order: IOrder = { id: 52294 };
      orderDetails.order = order;

      const orderCollection: IOrder[] = [{ id: 52344 }];
      jest.spyOn(orderService, 'query').mockReturnValue(of(new HttpResponse({ body: orderCollection })));
      const expectedCollection: IOrder[] = [order, ...orderCollection];
      jest.spyOn(orderService, 'addOrderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ orderDetails });
      comp.ngOnInit();

      expect(orderService.query).toHaveBeenCalled();
      expect(orderService.addOrderToCollectionIfMissing).toHaveBeenCalledWith(orderCollection, order);
      expect(comp.ordersCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const orderDetails: IOrderDetails = { id: 456 };
      const order: IOrder = { id: 89433 };
      orderDetails.order = order;

      activatedRoute.data = of({ orderDetails });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(orderDetails));
      expect(comp.ordersCollection).toContain(order);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrderDetails>>();
      const orderDetails = { id: 123 };
      jest.spyOn(orderDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orderDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: orderDetails }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(orderDetailsService.update).toHaveBeenCalledWith(orderDetails);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrderDetails>>();
      const orderDetails = new OrderDetails();
      jest.spyOn(orderDetailsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orderDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: orderDetails }));
      saveSubject.complete();

      // THEN
      expect(orderDetailsService.create).toHaveBeenCalledWith(orderDetails);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<OrderDetails>>();
      const orderDetails = { id: 123 };
      jest.spyOn(orderDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ orderDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(orderDetailsService.update).toHaveBeenCalledWith(orderDetails);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackOrderById', () => {
      it('Should return tracked Order primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackOrderById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
