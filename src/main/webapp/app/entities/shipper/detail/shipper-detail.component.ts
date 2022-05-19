import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IShipper } from '../shipper.model';

@Component({
  selector: 'jhi-shipper-detail',
  templateUrl: './shipper-detail.component.html',
})
export class ShipperDetailComponent implements OnInit {
  shipper: IShipper | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shipper }) => {
      this.shipper = shipper;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
