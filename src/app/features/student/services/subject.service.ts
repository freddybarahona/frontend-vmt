import { HttpClient} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Subject } from '../interfaces/subject';
import { GenericResponse } from '../../../core/interfaces/genericResponse';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
    private http = inject(HttpClient)
    private apiUrl = environment.apiUrl
    private branch = `${this.apiUrl}/subjects`
  
    getSubjectsByStudent(id: number): Observable<GenericResponse<Subject[]>> {
        return this.http.get<GenericResponse<Subject[]>>(
        `${this.branch}/getBy/${id}`
        )
    }
}
