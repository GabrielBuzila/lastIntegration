import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ShipperDetailComponent } from './shipper-detail.component';

describe('Shipper Management Detail Component', () => {
  let comp: ShipperDetailComponent;
  let fixture: ComponentFixture<ShipperDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShipperDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ shipper: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ShipperDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ShipperDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load shipper on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.shipper).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
