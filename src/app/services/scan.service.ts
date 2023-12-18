import { inject, Injectable } from '@angular/core';
import { Observable, switchMap, timer } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FoundNetwork } from '../types/foundNetwork';
import { toFormData } from '../utils/toFormData';
import { EffectData } from '../types/effect';

@Injectable({
  providedIn: 'root',
})
export class ScanService {
  private http = inject(HttpClient);

  scan() {
    return timer(0, 5000).pipe(
      switchMap(() => this.http.get('/api/scan')),
    ) as Observable<Array<FoundNetwork>>;
  }

  connect(ssid: string, password: string) {
    return this.http.post('/api/connect', toFormData({ ssid, password }));
  }

  set(r: number, g: number, b: number) {
    return this.http.post('/api/led', toFormData({ r, g, b }));
  }

  sendEffect(effect: EffectData) {
    return this.http.post('/api/effect', effect);
  }
}
