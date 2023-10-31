import { Component } from '@angular/core';
import { AppService, NameServer } from '../app.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-name-server-input-commons',
  templateUrl: './name-server-input-commons.component.html',
  styleUrls: ['./name-server-input-commons.component.scss']
})
export class NameServerInputCommonsComponent {

  nameServers!: NameServer[];
  contactForm: FormGroup;
  formGroup: any;
  disableAddButton: boolean = false;
  ipValidator: string = '/^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/';

  constructor(private nameServerService: AppService, private toastrService: ToastrService) {
    this.contactForm = new FormGroup({
      message: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.nameServerService.registeredNameServer.subscribe((data: any)=>{
      this.nameServers=data;
    });
  }

  onTextareaChange() {
    this.disableAddButton = this.contactForm.get('message')?.value !== '';
  }


  addNameServer() {
    let splitList = this.contactForm.get('message')?.value.split('\n');
    splitList.forEach((item: string) => {
      if (item.trim()) {
        //this.disableAddButton=false;
        let splitDomainIp = item.split(':');
        if(splitDomainIp?.length==0 || splitDomainIp?.length==1){
          this.toastrService.error(': is missing between Nameserver and its IP address. Please use format example "ns1.test.uk: 123.123.123.123"', 'Input Format Error');
          return;
        }
        
        var rgx = /^[0-9]*\.?[0-9]*$/; 
        const validateIP = splitDomainIp[1].match(rgx);
        console.log("val",validateIP);
        if(this.nameServers.length == 0 || this.nameServers.some(list => list.ip != splitDomainIp[1] || list.name != splitDomainIp[0])) {
          const obj = {
            id: Math.random().toString(4),
            name: splitDomainIp[0],
            ip: splitDomainIp[1],
          };
          this.nameServers.push(obj);
          this.nameServerService.registeredNameServer.next(this.nameServers);
          this.toastrService.success('New nameserver(s) added successfully ', 'Success!');
        } else{
          this.toastrService.error('Duplicate Nameservers found in your input. Please check. ' +item, 'Error');
        }
        
      }
    });
  }

}
