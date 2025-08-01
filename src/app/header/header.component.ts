import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isProjectDetailPage = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)) // ✅ Cast type
      .subscribe((event) => {
        const currentUrl = event.urlAfterRedirects;
        const isSlugOnly = /^\/[^\/]+$/.test(currentUrl); // matches `/some-slug` only

        this.isProjectDetailPage = isSlugOnly;
      });
  }
}
