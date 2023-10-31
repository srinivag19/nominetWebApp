import { Component } from '@angular/core';
import { AppService, NameServer } from '../app.service';

@Component({
  selector: 'app-manage-name-server',
  templateUrl: './manage-name-server.component.html',
  styleUrls: ['./manage-name-server.component.scss']
})
export class ManageNameServerComponent {

  title = 'manage-nameserver';
  nameServers!: NameServer[];
  newNameServer: string = '';
  domainInfo!: any[];

  constructor(private nameServerService: AppService) {

  }

  ngOnInit(): void {
    this.nameServers = [];
    this.domainInfo = this.nameServerService.getDomainInfo();
    this.nameServerService.getAllNameServers();
    this.nameServerService.registeredNameServer.subscribe((data: any) => {
      this.nameServers = data;
    });

  }

  deleteNameServer(id: string) {
    if (confirm('Are you sure you want to delete this name server?')) {
      this.nameServerService.deleteNameServer(id);

    }

  }
}
