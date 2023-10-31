import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameServerHeaderComponent } from './name-server-header.component';

describe('NameServerHeaderComponent', () => {
  let component: NameServerHeaderComponent;
  let fixture: ComponentFixture<NameServerHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NameServerHeaderComponent]
    });
    fixture = TestBed.createComponent(NameServerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
