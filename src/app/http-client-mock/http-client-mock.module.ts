import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { delay, map, of } from 'rxjs';

const Mock = {
  '/api/scan': [
    {
      rssi: -79,
      ssid: 'Evan-sky',
      bssid: '74:AC:B9:B4:00:B6',
      channel: 6,
      secure: 4,
      hidden: false,
    },
    {
      rssi: -82,
      ssid: 'AM-Private',
      bssid: '7A:AC:B9:B4:00:B6',
      channel: 6,
      secure: 4,
      hidden: false,
    },
    {
      rssi: -78,
      ssid: 'CYTA_eSZ8',
      bssid: 'C0:E3:FB:14:9E:14',
      channel: 7,
      secure: 8,
      hidden: false,
    },
    {
      rssi: -87,
      ssid: 'CYTA_K79t_EXT',
      bssid: 'D8:47:32:FF:6F:E9',
      channel: 1,
      secure: 8,
      hidden: false,
    },
    {
      rssi: -45,
      ssid: 'CYTA_4NRu',
      bssid: 'C0:E3:FB:14:6B:8C',
      channel: 11,
      secure: 8,
      hidden: false,
    },
    {
      rssi: -87,
      ssid: 'CYTA_Su49',
      bssid: 'D6:4F:67:26:76:BC',
      channel: 11,
      secure: 8,
      hidden: false,
    },
    {
      rssi: -78,
      ssid: 'CYTA_t7hF',
      bssid: 'E4:3E:C6:57:32:2C',
      channel: 1,
      secure: 8,
      hidden: false,
    },
  ],
};

class HttpClientMock {
  get(url: keyof typeof Mock) {
    return of(Mock).pipe(
      map((d) => d[url]),
      delay(200),
    );
  }

  post(url: string, data: any) {
    console.log('post', url, data);
    return of({}).pipe(delay(200));
  }
}
@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    {
      provide: HttpClient,
      // useClass: HttpClientMock,
      useFactory: () => new HttpClientMock(),
    },
  ],
})
export class HttpClientMockModule {}
