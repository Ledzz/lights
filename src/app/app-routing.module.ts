import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScanComponent } from './pages/scan/scan.component';
import { CalibrateComponent } from './pages/calibrate/calibrate.component';
import { EffectsComponent } from './pages/effects/effects.component';

const routes: Routes = [
  {
    path: 'scan',
    component: ScanComponent,
  },
  {
    path: 'calibrate',
    component: CalibrateComponent,
  },
  {
    path: 'effects',
    component: EffectsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
