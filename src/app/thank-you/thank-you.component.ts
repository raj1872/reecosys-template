import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.css'],
})
export class ThankYouComponent implements OnInit {
  projectName = '';
  brochureLink = '';

  constructor(
    private router: Router,
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const state = history.state;
      this.projectName = state.projectName || '';
      this.brochureLink = state.brochure || '';

      // Set dynamic page title
      this.titleService.setTitle(
        this.projectName
          ? `Thank You | ${this.projectName}`
          : 'Thank You - Reecosys'
      );

      // Redirect to home if no data
      if (!this.projectName && !this.brochureLink) {
        this.router.navigate(['/']);
      }
    }
  }
}
