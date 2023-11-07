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
        
        let splitDomainIp = item.split(':');
        if(splitDomainIp?.length<2){
          this.toastrService.error(': is missing between Nameserver and its IP address. Please use format example "ns1.test.uk: 123.123.123.123"', 'Input Format Error');
          return;
        }
        
        const isValidIp = /^(?:(?:^|\.)(?:2(?:5[0-5]|[0-4]\d)|1?\d?\d)){4}$/; 
        const isValidDns=/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}$/i;
        
        if(!isValidDns.test(splitDomainIp[0])){
          this.toastrService.error('DNS address format is invalid. Please check ' +splitDomainIp[0], 'Input Format Error');
          return;
        }else if(!isValidIp.test(splitDomainIp[1].trim())){
          this.toastrService.error('IP address format is invalid. Please check ' +splitDomainIp[1], 'Input Format Error');
          return;
        }
        if(this.nameServers.length == 0 || this.nameServers.some(list => list.ip != splitDomainIp[1] || list.name != splitDomainIp[0])) {
          const obj = {
            id: Math.random().toString(16),
            name: splitDomainIp[0],
            ip: splitDomainIp[1],
          };
          this.nameServers.push(obj);
          this.nameServerService.registeredNameServer.next(this.nameServers);
          this.toastrService.success('New nameserver(s) added successfully ', 'Success!');
        } else{
          this.toastrService.error('Duplicate Nameservers found in your input. Please check. ' +item, 'Error');
        }
        
      }else{
        this.toastrService.info('Nameserver cannot be empty ', 'Info');
      }
    });
  }

}
