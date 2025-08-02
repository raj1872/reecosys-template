import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  TransferState,
  makeStateKey,
  StateKey,
} from '@angular/platform-browser';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class GlobalApiService {
  private apiUrl = 'https://www.reecosys.com/api/Services/';
  private apiUrlAdmin = 'https://www.reecosys.com/api/Admin/';
  private authorizationKey =
    'User CXPNVIEIQMVJESPFKSKSMHNYNMVNXGYYHELVAZGNDVYHZUMKQM5891853093';
  private userName = 'Sahashya Group';

  public projectsFullList$ = new BehaviorSubject<any[]>([]);
  public projectsFullListCompleted$ = new BehaviorSubject<any[]>([]);
  public projectsCategory$ = new BehaviorSubject<any[]>([]);
  public pageFullList$ = new BehaviorSubject<any[]>([]);
  public blogList$ = new BehaviorSubject<any[]>([]);
  public homeList$ = new BehaviorSubject<any>({});
  public seoTitle$ = new BehaviorSubject<string>('');

  public loggedUserDetails: any = {};
  public loggedInMasterId = '506';
  public loggedInMasterUserId = '506';

  public loading = {
    blog: false,
    home: false,
  };
  // In global-api.service.ts
  countryList$ = new BehaviorSubject<any[]>([]);

  loadCountryList(): void {
    const key = makeStateKey<any[]>('countryList');
    const payload = {
      master_user_id: 506,
      logged_in_master_user_id: 506,
    };

    const apiCall = () =>
      this.http.post<any>(this.apiUrlAdmin + 'country/list', payload, {
        headers: this.headers,
      });

    this.ssrFetch(key, apiCall, (data) => {
      const filtered = (data || []).filter((c: any) => c.phonecode !== '92');
      this.countryList$.next(filtered);
    });
  }

  constructor(
    private http: HttpClient,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initGlobalDataOnServer(); // ✅ Load blog list on server
  }

  get headers(): HttpHeaders {
    return new HttpHeaders({
      Authorization: this.authorizationKey,
    });
  }

  // ✅ Safe SSR fetch with TransferState
  private ssrFetch<T>(
    key: StateKey<T>,
    apiCall: () => Observable<any>,
    onSuccess: (data: T) => void
  ): void {
    if (isPlatformBrowser(this.platformId)) {
      // 🔍 Read & remove only on browser
      if (this.transferState.hasKey(key)) {
        const data = this.transferState.get<T>(key, null as any);
        this.transferState.remove(key);
        onSuccess(data);
      }
    } else if (isPlatformServer(this.platformId)) {
      // 🌐 Server: fetch & store
      apiCall().subscribe((res) => {
        if (res?.success === 1) {
          onSuccess(res.data);
          this.transferState.set(key, res.data);
        }
      });
    }
  }

  private initGlobalDataOnServer(): void {
    if (isPlatformServer(this.platformId)) {
      this.loadBlogs(); // ✅ Preload on server
    }
  }

  loadProjects(): void {
    const key = makeStateKey<any[]>('projectsFullList');
    const body = {
      all_detail: 1,
      master_user_id: this.loggedInMasterId,
      logged_in_master_user_id: this.loggedInMasterUserId,
    };

    this.ssrFetch(
      key,
      () =>
        this.http.post<any>(this.apiUrl + 'properties/list', body, {
          headers: this.headers,
        }),
      (data) => {
        this.projectsFullList$.next(data);
        const categorySet = new Set(data.map((p: any) => p.category));
        const categories = Array.from(categorySet).map((cat) => ({
          category: cat,
        }));
        this.projectsCategory$.next(categories);
      }
    );
  }

  loadCompletedProjects(): void {
    const key = makeStateKey<any[]>('projectsCompletedList');
    const body = {
      all_detail: 1,
      master_user_id: this.loggedInMasterId,
      logged_in_master_user_id: this.loggedInMasterUserId,
    };

    this.ssrFetch(
      key,
      () =>
        this.http.post<any>(
          this.apiUrl + 'properties/completed_properties',
          body,
          { headers: this.headers }
        ),
      (data) => this.projectsFullListCompleted$.next(data)
    );
  }

  loadPages(): void {
    const key = makeStateKey<any[]>('pageFullList');
    const body = {
      master_user_id: this.loggedInMasterId,
      logged_in_master_user_id: this.loggedInMasterUserId,
    };

    this.ssrFetch(
      key,
      () =>
        this.http.post<any>(this.apiUrlAdmin + 'pages/list', body, {
          headers: this.headers,
        }),
      (data) => this.pageFullList$.next(data)
    );
  }

  loadBlogs(): void {
    const key = makeStateKey<any[]>('blogList');
    this.loading.blog = true;

    const body = {
      master_user_id: this.loggedInMasterId,
      logged_in_master_user_id: this.loggedInMasterUserId,
    };

    this.ssrFetch(
      key,
      () =>
        this.http.post<any>(this.apiUrl + 'blog/list', body, {
          headers: this.headers,
        }),
      (data) => {
        const blogs = data.map((b: any) => ({ ...b, tags: b.tags || [] }));
        this.blogList$.next(blogs);
        this.loading.blog = false;
      }
    );
  }

  loadHomeList(): void {
    const key = makeStateKey<any>('homeList');
    const body = {
      master_user_id: this.loggedInMasterId,
      logged_in_master_user_id: this.loggedInMasterUserId,
    };

    this.loading.home = true;

    this.ssrFetch(
      key,
      () =>
        this.http.post<any>(this.apiUrlAdmin + 'home/details', body, {
          headers: this.headers,
        }),
      (data) => {
        this.homeList$.next(data);
        this.seoTitle$.next(data.seo_title || 'Home');
        this.loading.home = false;
      }
    );
  }

  loadProjectDetail(slug: string): Observable<any> {
    const body = {
      all_detail: '1',
      slug: slug,
      master_user_id: this.loggedInMasterId,
      logged_in_master_user_id: this.loggedInMasterUserId,
    };

    return this.http.post<any>(this.apiUrl + 'properties/list', body, {
      headers: this.headers,
    });
  }
}
