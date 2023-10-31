import {
  ComponentFixture,
  TestBed,
  async
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AppService, NameServer } from '../app.service';
import { ManageNameServerComponent } from './manage-name-server.component';

describe('ManageNameServerComponent', () => {
  let component: ManageNameServerComponent;
  let fixture: ComponentFixture<ManageNameServerComponent>;
  let appService: AppService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageNameServerComponent],
      providers: [AppService],
      imports: [ReactiveFormsModule, ToastrModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageNameServerComponent);
    component = fixture.componentInstance;
    appService = TestBed.get(AppService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a name server', () => {
    const sampleNameServer = [
      { id: '0.e482173f908b7', name: 'ns1.test.uk', ip: '123.123.123.123' },
    ];
    appService.registeredNameServer.next(sampleNameServer);
    console.log(component.nameServers);
    appService.registeredNameServer.subscribe((item: NameServer[]) => {
      fixture.detectChanges();
      component.nameServers = item;
      if (component.nameServers.length) {
        expect(component.nameServers.length).toBe(1);
        expect(component.nameServers[0].ip).toBe('123.123.123.123');
        expect(component.nameServers[0].name).toBe('ns1.test.uk');
      }
    });
  });

  it('should delete a name server', () => {
    const sampleNameServer = [
      { id: '0.e482173f908b7', name: 'ns1.test.uk', ip: '123.123.123.123' },
    ];
    appService.registeredNameServer.next(sampleNameServer);
    appService.registeredNameServer.subscribe((item: NameServer[]) => {
      fixture.detectChanges();
      component.nameServers = item;
      if (component.nameServers.length) {
        component.deleteNameServer(component.nameServers[0]?.id);
      }
    });
  });
});
