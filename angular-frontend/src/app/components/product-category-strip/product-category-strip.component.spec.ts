import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategoryStripComponent } from './product-category-strip.component';

describe('ProductCategoryStripComponent', () => {
  let component: ProductCategoryStripComponent;
  let fixture: ComponentFixture<ProductCategoryStripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCategoryStripComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCategoryStripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
