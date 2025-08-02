import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InquiryFormComponent } from './inquiry-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [InquiryFormComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [InquiryFormComponent] // ✅ Important: export it
})
export class SharedModule {}
