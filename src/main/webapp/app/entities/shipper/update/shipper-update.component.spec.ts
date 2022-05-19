import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ShipperService } from '../service/shipper.service';
import { IShipper, Shipper } from '../shipper.model';

import { ShipperUpdateComponent } from './shipper-update.component';

describe('Shipper Management Update Component', () => {
  let comp: ShipperUpdateComponent;
  let fixture: ComponentFixture<ShipperUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let shipperService: ShipperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ShipperUpdateComponent],
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
      .overrideTemplate(ShipperUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShipperUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    shipperService = TestBed.inject(ShipperService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const shipper: IShipper = { id: 456 };

      activatedRoute.data = of({ shipper });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(shipper));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Shipper>>();
      const shipper = { id: 123 };
      jest.spyOn(shipperService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shipper });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shipper }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(shipperService.update).toHaveBeenCalledWith(shipper);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Shipper>>();
      const shipper = new Shipper();
      jest.spyOn(shipperService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shipper });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shipper }));
      saveSubject.complete();

      // THEN
      expect(shipperService.create).toHaveBeenCalledWith(shipper);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Shipper>>();
      const shipper = { id: 123 };
      jest.spyOn(shipperService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shipper });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(shipperService.update).toHaveBeenCalledWith(shipper);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
