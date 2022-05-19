import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ShipperService } from '../service/shipper.service';

import { ShipperComponent } from './shipper.component';

describe('Shipper Management Component', () => {
  let comp: ShipperComponent;
  let fixture: ComponentFixture<ShipperComponent>;
  let service: ShipperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ShipperComponent],
    })
      .overrideTemplate(ShipperComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShipperComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ShipperService);

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
    expect(comp.shippers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
