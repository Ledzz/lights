import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WsService {
  subject = webSocket(environment.ws);

  connection = this.subject.subscribe();
  send(colors: string[]) {
    this.subject.next({ seg: { i: [0, ...colors] } });
  }

  ngOnDestroy() {
    this.subject.complete(); // Closes the connection.
  }
}
