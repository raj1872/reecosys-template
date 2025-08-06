import {
  Component,
  OnInit,
  HostListener,
  Inject,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isProjectDetailPage = false;
  isMobileView = false;
  isBrowser = false;
  menuOpen = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.detectScreenSize();
      this.handleBodyScroll();
      this.router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe((event) => {
          const currentUrl = event.urlAfterRedirects;
          const isSlugOnly = /^\/[^\/]+$/.test(currentUrl) && !currentUrl.includes('thank-you');
          this.isProjectDetailPage = isSlugOnly;

          // Close nav on route change
          this.closeMenu();
        });
    }
  }

  @HostListener('window:resize')
  detectScreenSize() {
    if (this.isBrowser) {
      this.isMobileView = window.innerWidth <= 991;
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    if (this.menuOpen) {
      this.closeMenu();
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    this.handleBodyScroll();
  }

  closeMenu(): void {
    this.menuOpen = false;
    this.handleBodyScroll();
  }

  handleBodyScroll(): void {
    if (!this.isBrowser) return;

    if (this.menuOpen) {
      this.renderer.addClass(document.body, 'no-scroll');
    } else {
      this.renderer.removeClass(document.body, 'no-scroll');
    }
  }
}
