import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppModule } from './app.module';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { ServerTransferStateModule } from '@angular/platform-server'; // ✅ Needed for TransferState to work
import { AppComponent } from './app.component';

// ✅ Add this
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
