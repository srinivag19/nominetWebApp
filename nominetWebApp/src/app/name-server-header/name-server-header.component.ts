import { Component } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-name-server-header',
  templateUrl: './name-server-header.component.html',
  styleUrls: ['./name-server-header.component.scss']
})
export class NameServerHeaderComponent {

  domainInfo!: any[];

  constructor(private nameServerService: AppService) { }

  ngOnInit(): void {

    this.domainInfo = this.nameServerService.getDomainInfo();
  }


}
