import { Component, Input } from '@angular/core';
import { PopupService } from '../popup/popup.component';

@Component({
  selector: 'app-inquiry-popup',
  templateUrl: './inquiry-popup.component.html',
  styleUrls: ['./inquiry-popup.component.css']
})
export class InquiryPopupComponent {
  constructor(public popupService: PopupService) {}

  closePopup() {
    this.popupService.close();
  }
}
