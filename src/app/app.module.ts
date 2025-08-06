// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './pages/home/home.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SwiperModule } from 'swiper/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from './shared/inquiry-form/shared.module';
import { InquiryPopupComponent } from './shared/inquiry-popup/inquiry-popup.component'; // adjust path if needed

// import { SwiperModule } from './swiper/angular';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    InquiryPopupComponent,
    ProjectDetailComponent,
    ThankYouComponent  // ✅ Add this line
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    SwiperModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

