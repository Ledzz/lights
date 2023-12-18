import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WsService {
  subject = webSocket(environment.ws);

  connection = this.subject.subscribe();
  sendColors(colors: string[]) {
    this.subject.next({ seg: { i: [0, ...colors] } });
  }

  sendColor(color: string) {
    const values = Array(environment.ledsCount)
      .fill(null)
      .map((_, k) => 'ffffff');

    this.sendColors(values);
  }

  setBrightness(brightness: number) {
    this.subject.next({ bri: brightness });
  }

  ngOnDestroy() {
    this.subject.complete(); // Closes the connection.
  }
}
