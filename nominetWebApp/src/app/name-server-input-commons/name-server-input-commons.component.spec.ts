import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameServerInputCommonsComponent } from './name-server-input-commons.component';

import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

describe('NameServerInputCommonsComponent', () => {
  let component: NameServerInputCommonsComponent;
  let fixture: ComponentFixture<NameServerInputCommonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NameServerInputCommonsComponent],
      imports: [ReactiveFormsModule, ToastrModule.forRoot()],
    }).compileComponents();
    fixture = TestBed.createComponent(NameServerInputCommonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
