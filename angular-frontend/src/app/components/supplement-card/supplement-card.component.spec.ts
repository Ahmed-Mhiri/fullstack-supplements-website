import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplementCardComponent } from './supplement-card.component';

describe('SupplementCardComponent', () => {
  let component: SupplementCardComponent;
  let fixture: ComponentFixture<SupplementCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplementCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplementCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
