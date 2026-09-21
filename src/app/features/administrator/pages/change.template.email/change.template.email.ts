import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../../shared/components/header-component/header-component';
import { EmailService } from '../../services/email.service';
import { CreateTemplateEmailRequest } from '../../requests/create.template.email.request';

@Component({
  selector: 'app-change-template-email',
  imports: [FormsModule, HeaderComponent],
  templateUrl: './change.template.email.html',
})
export class ChangeTemplateEmail {
  private emailService = inject(EmailService);

  subject = '';
  htmlContent = '';
  loading = false;
  successMessage = '';
  errors = signal<string[]>([]);

  guardarPlantilla(): void {
    this.loading = true;
    this.successMessage = '';
    this.errors.set([]);

    const payload: CreateTemplateEmailRequest = {
      subject: this.subject,
      htmlContent: this.htmlContent,
    };

    this.emailService.UpdateTemplate(payload).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = response.message;
      },
      error: (error) => {
        this.loading = false;
        this.errors.set(error.error?.errors ?? ['No se pudo guardar la plantilla']);
      },
    });
  }
}
