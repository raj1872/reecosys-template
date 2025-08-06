import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class PopupService {
  isOpen = false;
  popupType: 'inquiry' | 'brochure' = 'inquiry';
  projectId: string | null = null;
  projectName: string = '';
  brochureLink: string = '';

  open(
    type: 'inquiry' | 'brochure',
    projectId: number | string | null = null,
    projectName: string = '',
    brochureLink: string = ''
  ) {
    this.popupType = type;
    this.projectId = projectId?.toString() || null;
    this.projectName = projectName;
    this.brochureLink = brochureLink;
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen = false;
    this.projectId = null;
    this.projectName = '';
    this.brochureLink = '';
    document.body.style.overflow = '';
  }
}
