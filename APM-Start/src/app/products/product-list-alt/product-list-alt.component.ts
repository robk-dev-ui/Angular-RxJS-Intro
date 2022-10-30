import { Component, ChangeDetectionStrategy } from '@angular/core';

import { catchError, EMPTY, Subject } from 'rxjs';

import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  private _errorMessageSubject = new Subject<string>();
  errorMessage$ = this._errorMessageSubject.asObservable();

  products$ = this.productService.productsWithAdd$
    .pipe(
      catchError(err => {
        this._errorMessageSubject.next(err);
        return EMPTY;
      })
    )

  selectedProduct$ = this.productService.selectedProduct$;
    
  constructor(private productService: ProductService) { }

  onSelected(productId: number): void {
    this.productService.selectedProductChanged(productId);
  }
}
