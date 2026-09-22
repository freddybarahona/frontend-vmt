import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { GenericResponse } from '../../../core/interfaces/genericResponse';
import { Observable } from 'rxjs';
import { CreateTemplateEmailRequest } from '../requests/create.template.email.request';
import { Email } from '../interfaces/email';

@Service()
export class EmailService {
  private http = inject(HttpClient)
  private apiUrl = environment.apiUrl
  private branch = `${this.apiUrl}/email`

  updateTemplate(request: CreateTemplateEmailRequest): Observable<GenericResponse<null>>{
    return this.http.post<GenericResponse<null>>(`${this.branch}/content`,request)
  }

  getTemplate({ id }: { id: number }): Observable<GenericResponse<Email>>{
    return this.http.get<GenericResponse<Email>>(`${this.branch}/content/${id}`)
  }
}  
