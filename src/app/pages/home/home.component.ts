import { Component, OnInit } from '@angular/core';
import { GlobalApiService } from '../../services/global-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  projects: any[] = [];
  completedProjects: any[] = [];
  pages: any[] = [];
  homeList: any = {};

  constructor(public globalApi: GlobalApiService) {}

  ngOnInit(): void {
    this.globalApi.loadHomeList();
  
    this.globalApi.projectsFullList$.subscribe((data) => {
      this.projects = data;
      // console.log('Projects:', this.projects);
    });

  
    this.globalApi.projectsFullListCompleted$.subscribe((data) => {
      this.completedProjects = data;
      // console.log('Completed Projects:', this.completedProjects);
    });

    this.globalApi.pageFullList$.subscribe((data) => {
      this.pages = data;
      // console.log('Pages:', this.pages);
    });

    this.globalApi.homeList$.subscribe((data) => {
      this.homeList = data;
      // console.log('Home Details:', this.homeList);
    });
  }
}
