import { Component, OnInit } from '@angular/core';
import { GlobalApiService } from './services/global-api.service';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'reecosys-template';

  constructor(
    public globalApi: GlobalApiService,
    private titleService: Title,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.globalApi.loadProjects();
    this.globalApi.loadCompletedProjects();
    this.globalApi.loadPages();
    // this.globalApi.loadBlogs();
    
    
  }
}
