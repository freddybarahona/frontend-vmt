import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../../shared/components/header-component/header-component';
import { EmailService } from '../../services/email.service';
import { CreateTemplateEmailRequest } from '../../requests/create.template.email.request';

@Component({
  selector: 'app-change-template-email',
  imports: [FormsModule, HeaderComponent],
  templateUrl: './change.template.email.html',
})
export class ChangeTemplateEmail implements OnInit {
  private emailService = inject(EmailService);
  subject = '';
  htmlContent = '';
  dbSubject = '';
  dbHtmlContent = '';
  loading = signal(false);
  successMessage = '';
  errors = signal<string[]>([]);

  ngOnInit(): void {
    this.obtenerPlantilla();
  }

  cargarEnEditor(opcion: "subject" | "htmlContent"){
    this.successMessage = '';
    this.errors.set([]);
    switch (opcion) {
      case "subject":
        this.subject = this.dbSubject;
        break;
      case "htmlContent":
        this.htmlContent = this.dbHtmlContent;
        break;
    }
  }

  guardarPlantilla(): void {
    this.loading.set(true);
    this.successMessage = '';
    this.errors.set([]);

    const payload: CreateTemplateEmailRequest = {
      subject: this.subject,
      htmlContent: this.htmlContent,
    };

    this.emailService.updateTemplate(payload).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.successMessage = response.message;
        this.obtenerPlantilla();
      },
      error: (error) => {
        this.loading.set(false);
        this.errors.set(error.error?.errors ?? ['No se pudo guardar la plantilla']);
      },
    });
  }

  obtenerPlantilla(){
    this.errors.set([])
    this.loading.set(true);
    this.emailService.getTemplate({ id: 1 }).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.dbSubject = response.data.subject;
        this.dbHtmlContent = response.data.htmlContent;
      },
      error: (error) => {
        this.loading.set(false);
        this.errors.set(error.error?.errors ?? ['No se pudo obtener la plantilla']);
      },
    });
  }
}
