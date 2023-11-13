import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';

export class NameServer {
    "id": string;
    "name"?: string;
    "ip"?: string;
}

@Injectable({
    providedIn: 'root',
})
export class AppService {

    private nameServers: NameServer[] = [];

    public registeredNameServer: any = new BehaviorSubject([]);

    getAllNameServers() {
        this.registeredNameServer.next(this.nameServers);

    }

    addNameServers(nameServer: NameServer) : Observable<NameServer>{
        
        return of(nameServer);
    }


    deleteNameServer(id: string): void {
        const serverIndex = this.nameServers.findIndex(
            (server) => server.id === id
        );
        if (serverIndex !== -1) {
            this.nameServers.splice(serverIndex, 1);
        }
    }

    getDomainInfo(): any {
        return [
            { domain: 'example.uk', registrar: 'Test Registrar' },
        ];
    }
}