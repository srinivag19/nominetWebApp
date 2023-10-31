import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageNameServerComponent } from './manage-name-server.component';

describe('ManageNameServerComponent', () => {
  let component: ManageNameServerComponent;
  let fixture: ComponentFixture<ManageNameServerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageNameServerComponent]
    });
    fixture = TestBed.createComponent(ManageNameServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
