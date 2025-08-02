import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import {
  Title,
  Meta,
  TransferState,
  makeStateKey,
} from '@angular/platform-browser';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { GlobalApiService } from '../services/global-api.service';
import { Fancybox } from '@fancyapps/ui';
import { SwiperComponent } from 'swiper/angular';
import { SwiperOptions } from 'swiper';
import SwiperCore, { Pagination } from 'swiper';
SwiperCore.use([Pagination]);
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
})
export class ProjectDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('swiperRef', { static: false }) swiperRef?: SwiperComponent;

  slug = '';
  projectData: any = null;
  loading = true;
  imageLoaded = false;
  hasBrochure = false;
  isBrowser = false;
  safeMapUrl: SafeResourceUrl | null = null;
  private STATE_KEY: any;

  public repeatArray = Array(20);
  public selectedTab: 'interior' | 'exterior' = 'interior';

  public mySwiperConfig: SwiperOptions = {
    slidesPerView: 3.2,
    spaceBetween: 15,
    slidesOffsetBefore: 80,
    slidesOffsetAfter: 80,
    loop: false,
    grabCursor: true,
    pagination: {
      el: '.swiper-pagination-amenities',
      type: 'progressbar',
      clickable: true,
    },
    breakpoints: {
      1680: {
        slidesPerView: 3,
        spaceBetween: 15,
        slidesOffsetBefore: 80,
        slidesOffsetAfter: 80,
      },
      1450: {
        slidesPerView: 2.8,
        spaceBetween: 15,
        slidesOffsetBefore: 85,
        slidesOffsetAfter: 85,
      },
      1366: {
        slidesPerView: 2.6,
        spaceBetween: 15,
        slidesOffsetBefore: 107,
        slidesOffsetAfter: 107,
      },
      1280: {
        slidesPerView: 2.5,
        spaceBetween: 20,
        slidesOffsetBefore: 128,
        slidesOffsetAfter: 128,
      },
      1152: {
        slidesPerView: 2.25,
        spaceBetween: 20,
        slidesOffsetBefore: 115,
        slidesOffsetAfter: 115,
      },
      1024: {
        slidesPerView: 2,
        spaceBetween: 20,
        slidesOffsetBefore: 62,
        slidesOffsetAfter: 62,
      },
      991: {
        slidesPerView: 1.8,
        spaceBetween: 20,
        slidesOffsetBefore: 24,
        slidesOffsetAfter: 24,
      },
      768: {
        slidesPerView: 1.5,
        spaceBetween: 18,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
      },
      640: {
        slidesPerView: 1.25,
        spaceBetween: 15,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
      },
      480: {
        slidesPerView: 1.1,
        spaceBetween: 12,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
      },
      375: {
        slidesPerView: 1.05,
        spaceBetween: 12,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 10,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
      },
    },
  };

  constructor(
    private globalApi: GlobalApiService,
    private sanitizer: DomSanitizer,
    private state: TransferState,
    private titleService: Title,
    private metaService: Meta,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    this.STATE_KEY = makeStateKey<any>(`project-detail-${this.slug}`);

    if (this.state.hasKey(this.STATE_KEY)) {
      this.projectData = this.state.get<any>(this.STATE_KEY, null);
      this.setSeoAndExtras();
      this.loading = false;
      this.state.remove(this.STATE_KEY);
    }
  }

  async ngOnInit(): Promise<void> {
    if (!this.slug) {
      this.router.navigate(['/']);
      return;
    }

    if (this.projectData) return;

    try {
      const response = await firstValueFrom(
        this.globalApi.loadProjectDetail(this.slug)
      );

      if (response?.success === 1 && response.data?.length > 0) {
        this.projectData = response.data[0];

        if (isPlatformServer(this.platformId)) {
          this.state.set(this.STATE_KEY, this.projectData);
        }

        this.setSeoAndExtras();
      } else {
        this.router.navigate(['/']);
        return;
      }
    } catch (error) {
      console.error('⚠️ Project fetch error:', error);
      this.router.navigate(['/']);
      return;
    }

    this.loading = false;
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      Fancybox.bind('[data-fancybox]');

      // ✅ Force swiper update for proper breakpoint alignment
      setTimeout(() => {
        this.swiperRef?.swiperRef?.update();
      }, 1500);
    }
  }

  setTab(tab: 'interior' | 'exterior') {
    this.selectedTab = tab;
  }

  getGalleryImage(index: number, width: number, height: number): string {
    const gallery = this.projectData?.gallery_data?.[0]?.image || [];
    const filtered = gallery.filter(
      (img: any) => (img.title || '').toLowerCase() === this.selectedTab
    );
    const img = filtered[index];
    return img
      ? `${img.image}&w=${width}&h=${height}&q=100`
      : `https://dummyimage.com/${width}x${height}/000/fff`;
  }

  openFullGallery(): void {
    if (this.isBrowser && this.projectData?.gallery_data?.[0]?.image) {
      const images = this.projectData.gallery_data[0].image.map((img: any) => ({
        src: img['image_full'],
        thumb: img['image'],
        type: 'image',
      }));
      Fancybox.show(images, { groupAll: true });
    }
  }

  getGalleryImageHref(index: number): string | null {
    const gallery = this.projectData?.gallery_data?.[0]?.image || [];
    const filtered = gallery.filter(
      (img: any) => (img.title || '').toLowerCase() === this.selectedTab
    );
    const img = filtered[index];
    return img?.['image_full'] || null;
  }

  private setSeoAndExtras() {
    this.hasBrochure = this.projectData?.document_other_data?.some(
      (doc: any) => doc.type === 'Brochure'
    );
    this.titleService.setTitle(
      this.projectData?.page_title || 'Project Detail'
    );
    this.metaService.updateTag({
      name: 'description',
      content: this.projectData?.page_description || '',
    });
    this.metaService.updateTag({
      name: 'keywords',
      content: this.projectData?.page_keywords || '',
    });

    if (this.projectData?.map_iframe) {
      this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.projectData.map_iframe
      );
    }
  }
}
