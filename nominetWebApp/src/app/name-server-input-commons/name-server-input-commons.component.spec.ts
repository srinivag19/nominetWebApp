import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameServerInputCommonsComponent } from './name-server-input-commons.component';

describe('NameServerInputCommonsComponent', () => {
  let component: NameServerInputCommonsComponent;
  let fixture: ComponentFixture<NameServerInputCommonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NameServerInputCommonsComponent]
    });
    fixture = TestBed.createComponent(NameServerInputCommonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
