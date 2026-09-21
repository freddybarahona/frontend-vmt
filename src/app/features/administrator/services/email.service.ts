import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { GenericResponse } from '../../../core/interfaces/genericResponse';
import { Observable } from 'rxjs';
import { CreateTemplateEmailRequest } from '../requests/create.template.email.request';

@Service()
export class EmailService {
  private http = inject(HttpClient)
  private apiUrl = environment.apiUrl
  private branch = `${this.apiUrl}/email`

  UpdateTemplate(request: CreateTemplateEmailRequest): Observable<GenericResponse<null>>{
    return this.http.post<GenericResponse<null>>(`${this.branch}/content`,request)
  }
}
