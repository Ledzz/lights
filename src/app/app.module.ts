import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ScanComponent } from './pages/scan/scan.component';
import { environment } from '../environments/environment';
import { HttpClientMockModule } from './http-client-mock/http-client-mock.module';
import { EffectsComponent } from './pages/effects/effects.component';
import { EffectComponent } from './components/effect/effect.component';

console.log(environment.mockRequests);

@NgModule({
  declarations: [AppComponent, ScanComponent, EffectsComponent, EffectComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    environment.mockRequests ? HttpClientMockModule : HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
