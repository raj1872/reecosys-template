import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryPopupComponent } from './inquiry-popup.component';

describe('InquiryPopupComponent', () => {
  let component: InquiryPopupComponent;
  let fixture: ComponentFixture<InquiryPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InquiryPopupComponent]
    });
    fixture = TestBed.createComponent(InquiryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
