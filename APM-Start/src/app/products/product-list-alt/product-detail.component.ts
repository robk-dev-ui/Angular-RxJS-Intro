import { ChangeDetectionStrategy, Component } from '@angular/core';
import { catchError, combineLatest, EMPTY, filter, map, Subject } from 'rxjs';
import { Supplier } from 'src/app/suppliers/supplier';

import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductDetailComponent {
  private _errorMessageSubject = new Subject<string>();
  errorMessage$ = this._errorMessageSubject.asObservable();

  product$ = this.productService.selectedProduct$
    .pipe(
      catchError(err => {
        this._errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  pageTitle$ = this.product$
    .pipe(
      map(p => p ? `Product Detail for: ${p.productName}` : null)
    );

  productSuppliers$ = this.productService.selectedProductSuppliers$
    .pipe(
      catchError(err => {
        this._errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  vm$ = combineLatest([
    this.product$,
    this.productSuppliers$,
    this.pageTitle$
  ]).pipe(
    filter(([product]) => Boolean(product)),
    map(([product, productSuppliers, pageTitle]) =>
    ({ product, productSuppliers, pageTitle}))
  );

  constructor(private productService: ProductService) { }

}
