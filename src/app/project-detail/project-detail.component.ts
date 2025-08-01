import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalApiService } from '../services/global-api.service';
import {
  Title,
  Meta,
  TransferState,
  makeStateKey,
} from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { Fancybox } from '@fancyapps/ui';
import { SwiperOptions } from 'swiper';

interface GalleryImage {
  image_id: number;
  image: string;
  title: string;
  [key: string]: any; // for other optional fields
}

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
})
export class ProjectDetailComponent implements OnInit, AfterViewInit {
  slug = '';
  projectData: any = null;
  loading = true;
  imageLoaded = false;
  hasBrochure = false;
  isBrowser = false;
  public repeatArray = Array(20); // Adjust how many times to repeat text
  public selectedTab: 'interior' | 'exterior' = 'interior';

  public mySwiperConfig: SwiperOptions = {
    slidesPerView: 3.2,
    spaceBetween: 15,
    slidesOffsetBefore: 200,
    slidesOffsetAfter: 200,
    loop: false,
    grabCursor: true,
    breakpoints: {
      1280: {
        slidesPerView: 5,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 25,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      640: {
        slidesPerView: 1.2,
        spaceBetween: 15,
      },
    },
  };

  constructor(
    private globalApi: GlobalApiService,
    private state: TransferState,
    private titleService: Title,
    private metaService: Meta,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';

    if (this.slug) {
      this.loadProjectDetail(this.slug);
    } else {
      this.loading = false;
      console.warn('❌ No slug found. Redirecting to home.');
      this.router.navigate(['/']);
    }
  }

  

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      Fancybox.bind('[data-fancybox]');
    }
  }

  loadProjectDetail(slug: string): void {
    this.loading = true;
    const STATE_KEY = makeStateKey<any>(`project-detail-${slug}`);

    if (this.state.hasKey(STATE_KEY)) {
      this.projectData = this.state.get<any>(STATE_KEY, null);
      this.setSeoAndExtras();
      this.loading = false;
    } else {
      this.globalApi.loadProjectDetail(slug).subscribe(
        (response) => {
          this.loading = false;
          if (response?.success === 1 && response.data?.length > 0) {
            this.projectData = response.data[0];
            this.state.set(STATE_KEY, this.projectData);
            this.setSeoAndExtras();
          } else {
            this.router.navigate(['/']);
          }
        },
        (error) => {
          this.loading = false;
          console.error('⚠️ Error loading project detail:', error);
          this.router.navigate(['/']);
        }
      );
    }
  }

  setTab(tab: 'interior' | 'exterior') {
    this.selectedTab = tab;
  }

  getGalleryImage(index: number, width: number, height: number): string {
    const gallery: GalleryImage[] =
      this.projectData?.gallery_data?.[0]?.image || [];
    const filtered = gallery.filter(
      (img) => (img.title || '').toLowerCase() === this.selectedTab
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

      Fancybox.show(images, {
        groupAll: true,
      });
    }
  }

  getGalleryImageHref(index: number): string | null {
    const gallery: GalleryImage[] =
      this.projectData?.gallery_data?.[0]?.image || [];
    const filtered = gallery.filter(
      (img) => (img.title || '').toLowerCase() === this.selectedTab
    );
    const img = filtered[index];
    return img?.['image_full'] || null;
  }

  private setSeoAndExtras() {
    this.hasBrochure = this.projectData.document_other_data?.some(
      (doc: any) => doc.type === 'Brochure'
    );

    this.titleService.setTitle(this.projectData.page_title || 'Project Detail');
    this.metaService.updateTag({
      name: 'description',
      content: this.projectData.page_description || '',
    });
    this.metaService.updateTag({
      name: 'keywords',
      content: this.projectData.page_keywords || '',
    });
  }
}
