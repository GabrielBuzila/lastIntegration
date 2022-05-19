import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { OrderDetailsService } from '../service/order-details.service';

import { OrderDetailsComponent } from './order-details.component';

describe('OrderDetails Management Component', () => {
  let comp: OrderDetailsComponent;
  let fixture: ComponentFixture<OrderDetailsComponent>;
  let service: OrderDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [OrderDetailsComponent],
    })
      .overrideTemplate(OrderDetailsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrderDetailsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OrderDetailsService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.orderDetails?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
