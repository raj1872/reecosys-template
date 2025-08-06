import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ThankYouComponent } from './thank-you/thank-you.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'thank-you', component: ThankYouComponent },
  { path: ':slug', component: ProjectDetailComponent },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
