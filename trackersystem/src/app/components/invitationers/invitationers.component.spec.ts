import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationersComponent } from './invitationers.component';

describe('InvitationersComponent', () => {
  let component: InvitationersComponent;
  let fixture: ComponentFixture<InvitationersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvitationersComponent]
    });
    fixture = TestBed.createComponent(InvitationersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
