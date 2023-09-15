import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbooksComponent } from './addbooks.component';

describe('AddbooksComponent', () => {
  let component: AddbooksComponent;
  let fixture: ComponentFixture<AddbooksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddbooksComponent]
    });
    fixture = TestBed.createComponent(AddbooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
