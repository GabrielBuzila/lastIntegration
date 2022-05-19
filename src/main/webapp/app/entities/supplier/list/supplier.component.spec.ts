import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SupplierService } from '../service/supplier.service';

import { SupplierComponent } from './supplier.component';

describe('Supplier Management Component', () => {
  let comp: SupplierComponent;
  let fixture: ComponentFixture<SupplierComponent>;
  let service: SupplierService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SupplierComponent],
    })
      .overrideTemplate(SupplierComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SupplierComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SupplierService);

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
    expect(comp.suppliers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
