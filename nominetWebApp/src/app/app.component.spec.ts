import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { NameServerHeaderComponent } from './name-server-header/name-server-header.component';
import { ManageNameServerComponent } from './manage-name-server/manage-name-server.component';
import { NameServerInputCommonsComponent } from './name-server-input-commons/name-server-input-commons.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

describe('AppComponent', async () => {
  await beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, ReactiveFormsModule, ToastrModule.forRoot()],
    declarations: [AppComponent, NameServerHeaderComponent,
      ManageNameServerComponent,
      NameServerInputCommonsComponent],}).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'nominetWebApp'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('nominetWebApp');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('nominetWebApp app is running!');
  });

