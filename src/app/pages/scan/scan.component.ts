import { Component, inject } from '@angular/core';
import { ScanService } from '../../services/scan.service';
import { FoundNetwork } from '../../types/foundNetwork';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styles: [],
})
export class ScanComponent {
  private scanService = inject(ScanService);
  scan$ = this.scanService.scan();

  select(network: FoundNetwork) {
    const password = prompt('Enter password');
    if (password) {
      this.scanService.connect(network.ssid, password).subscribe();
    }
  }
}
