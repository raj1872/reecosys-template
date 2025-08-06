import {
  Component,
  Input,
  OnInit,
  HostListener,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalApiService } from '../../services/global-api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OnChanges, SimpleChanges } from '@angular/core';
import { PopupService } from '../popup/popup.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inquiry-form',
  templateUrl: './inquiry-form.component.html',
  styleUrls: ['./inquiry-form.component.css'],
})
export class InquiryFormComponent implements OnInit {
  @Input() projectId: string | null = null;
  @Input() popupType: 'inquiry' | 'brochure' = 'inquiry';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectId'] && this.inquiryForm) {
      this.inquiryForm.get('project_id')?.setValue(this.projectId || '');
    }
  }

  inquiryForm!: FormGroup;
  submitting = false;
  submitted = false;
  errorMessage = '';

  selectedCountry: any = {
    phonecode: '91',
    flag: 'https://flagcdn.com/w40/in.webp',
  };
  countryList: any[] = [];
  countryDropdownOpen = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public popupService: PopupService,
    private router: Router,
    public globalApi: GlobalApiService,
    private _eref: ElementRef
  ) {}

  ngOnInit(): void {
    this.inquiryForm = this.fb.group({
      client_name: ['', Validators.required],
      email_address: ['', [Validators.required, Validators.email]],
      client_contact_no: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]*$/), // Only digits
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      preferred_mode: ['Call'],
      preferred_type: ['4 BHK'],
      remarks: [''],
      agree_tandc: [true, Validators.requiredTrue],
      project_id: [this.projectId || '', Validators.required],
    });

    this.loadCountryList();
    if (!this.projectId) this.loadProjectList();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this._eref.nativeElement.contains(event.target)) {
      this.countryDropdownOpen = false;
    }
  }

  loadCountryList() {
    this.globalApi.countryList$.subscribe((res) => {
      this.countryList = res.filter((c: any) => c.phonecode !== '92');
    });
  }

  loadProjectList() {
    this.globalApi.projectsFullList$.subscribe((res) => {
      // You may optionally auto-select a project here
    });
  }
  onPhoneInput(event: any): void {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
    this.inquiryForm.get('client_contact_no')?.setValue(event.target.value);
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.countryDropdownOpen = !this.countryDropdownOpen;
  }

  selectCountry(country: any, event: MouseEvent) {
    event.stopPropagation();
    this.selectedCountry = country;
    this.countryDropdownOpen = false;
  }

  onSubmit() {

    if (this.inquiryForm.invalid) {
      this.inquiryForm.markAllAsTouched();
      return;
    }

    const pref = this.inquiryForm.get('preferred_mode')?.value || 'Call';
    const pref_type = this.inquiryForm.get('preferred_type')?.value || '4 BHK';
    const remarksValue = this.inquiryForm.get('remarks')?.value || '';

    const updatedRemarks = remarksValue
      ? `${remarksValue} | Preferred Contact: ${pref} | Type: ${pref_type}`
      : `Preferred Contact: ${pref} | Type: ${pref_type}`;

    this.inquiryForm.patchValue({ remarks: updatedRemarks });

    const form = this.inquiryForm.value;
    const fullContactNo = `${this.selectedCountry.phonecode} ${form.client_contact_no}`;

    const payload = {
      ...form,
      client_contact_no: fullContactNo,
      country: this.selectedCountry.phonecode,
      flag: this.selectedCountry.flag,
      agree_tandc: '1',
      agree_tandc_display: true,
      from_app: 'true',
      inquiry_from: 'web',
      logged_in_master_user_id: 506,
      master_user_id: 506,
      user_type: 'N',
    };

    this.submitting = true;
    this.errorMessage = '';

    const headers = new HttpHeaders({
      Authorization:
        'User CXPNVIEIQMVJESPFKSKSMHNYNMVNXGYYHELVAZGNDVYHZUMKQM5891853093',
    });

    this.http
      .post('https://www.reecosys.com/api/Services/inquiries/save', payload, {
        headers,
      })
      .subscribe({
        next: (res: any) => {
          this.submitting = false;
          if (res.success === 1) {
            this.submitted = true;
            this.inquiryForm.reset({
              preferred_mode: 'Call',
              preferred_type: '4 BHK',
              agree_tandc: true,
              project_id: this.projectId || '',
            });

            // ✅ Close the popup
            // this.popupService.close();

            // ✅ Redirect to Thank You with optional params
            this.router.navigate(['/thank-you'], {
              state: {
                projectName: this.popupService.projectName,
                brochure: this.popupService.brochureLink,
              },
            });

            this.popupService.close(); // close popup
          } else {
            this.errorMessage = res?.message || 'Submission failed.';
          }
        },
        error: () => {
          this.submitting = false;
          this.errorMessage = 'Something went wrong. Please try again.';
        },
      });
  }
}
