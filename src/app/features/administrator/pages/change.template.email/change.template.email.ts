import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../../shared/components/header-component/header-component';
import { EmailService } from '../../services/email.service';
import { CreateTemplateEmailRequest } from '../../requests/create.template.email.request';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../../auth/services/auth-service';
import { CorreoCodigoVerificacionRequest } from '../../../../shared/interfaces/correo-codigo-verificacion-request';

@Component({
  selector: 'app-change-template-email',
  imports: [FormsModule, HeaderComponent],
  templateUrl: './change.template.email.html',
})
export class ChangeTemplateEmail implements OnInit {
  private emailService = inject(EmailService);
  private authService = inject(AuthService);
  private sanitizer = inject(DomSanitizer)
  subject = '';
  htmlContent = signal('');
  dbSubject = '';
  dbHtmlContent = signal('');
  loading = signal(false);
  successMessage = '';
  errors = signal<string[]>([]);
  mostrarConsejos = signal(false);
  emailPrueba = '';
  probando = signal(false);

  private readonly PLANTILLA_BASE_EMAIL_SAFE = `<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" align="center" style="background-color:#ffffff;border:1px solid #e2e8f0;border-radius:16px">
  <tr>
    <td style="padding:32px">
      <h1 style="font-size:24px;line-height:1.2;color:#1e293b;margin:0 0 16px">EduSystem</h1>
      <p style="font-size:16px;line-height:1.5;color:#334155;margin:0 0 12px">Hola \${name},</p>
      <p style="font-size:16px;line-height:1.5;color:#334155;margin:0 0 20px">Tu código de verificación es:</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin-top:24px;margin-bottom:24px">
        <tr>
          <td style="background-color:#f1f5f9;border-radius:12px;padding-top:16px;padding-right:32px;padding-bottom:16px;padding-left:32px">
            <span style="font-size:32px;line-height:1.2;font-weight:800;letter-spacing:4px;color:#2563eb">\${code}</span>
          </td>
        </tr>
      </table>
      <p style="font-size:14px;line-height:1.5;color:#64748b;margin:24px 0 0">Si no solicitaste este código, ignora este mensaje.</p>
    </td>
  </tr>
</table>
<p style="font-size:12px;line-height:1.5;color:#94a3b8;text-align:center;margin-top:16px">Mensaje automático — EduSystem</p>`

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
        this.htmlContent.set(this.dbHtmlContent())
        break;
    }
  }

  usarPlantillaBase(): void {
    this.successMessage = '';
    this.errors.set([]);
    this.subject = 'Verificación de cuenta EduSystem';
    this.htmlContent.set(this.PLANTILLA_BASE_EMAIL_SAFE);
  }

  probarPlantillaActual(): void {
    this.successMessage = '';
    this.errors.set([]);

    if (this.emailPrueba.trim().length === 0) {
      this.errors.set(['Primero escribe el correo al que enviar la prueba']);
      return;
    }

    const payload: CorreoCodigoVerificacionRequest = {
      email: this.emailPrueba.trim(),
      name: 'Freddy Barahona',
      identificacion: '1234567890',
      password: 'Password123',
      repeatPassword: 'Password123',
      role: 'STUDENT',
      subject: this.subject,
      htmlContent: this.htmlContent(),
    };

    this.probando.set(true);
    this.authService.correoCodigoVerificacion(payload).subscribe({
      next: (response) => {
        this.probando.set(false);
        this.successMessage = response.message;
      },
      error: (error) => {
        this.probando.set(false);
        this.errors.set(error.error?.errors ?? ['No se pudo enviar el correo de prueba']);
      },
    });
  }

  guardarPlantilla(): void {
    this.loading.set(true);
    this.successMessage = '';
    this.errors.set([]);

    const payload: CreateTemplateEmailRequest = {
      subject: this.subject,
      htmlContent: this.htmlContent(),
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
        this.dbHtmlContent.set(response.data.htmlContent)
      },
      error: (error) => {
        this.loading.set(false);
        this.errors.set(error.error?.errors ?? ['No se pudo obtener la plantilla']);
      },
    });
  }

  //metodos para permitir que el previsualizador compile css y tailwind

  private tailwindCdn = '<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>';

  private envolverConTailwind(html: string): SafeHtml {
    const yaIncluyeTailwind = html.includes('@tailwindcss/browser') || html.includes('tailwindcss.com');
    const doc = yaIncluyeTailwind ? html : 
    `<!doctype html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${this.tailwindCdn}
      </head>
      <body>
        ${html}
      </body>
      </html>`
    return this.sanitizer.bypassSecurityTrustHtml(doc);
  }

  previewHtml= computed(()=> this.envolverConTailwind(this.htmlContent()))

  previewDbHtml = computed(() => this.envolverConTailwind(this.dbHtmlContent()))
}

/* computed es una señal derivada que se memoiza solo se actualiza cuando hay un cambio */