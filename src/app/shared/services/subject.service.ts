import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { GenericResponse } from '../../core/interfaces/genericResponse';
import { Subject } from '../interfaces/subject';

@Service()
export class SubjectService {
    private http = inject(HttpClient)
    private api_url= environment.apiUrl
    private branch = `${this.api_url}/subjects`

    getAll(): Observable<GenericResponse<Subject[]>>{
        return this.http.get<GenericResponse<Subject[]>>(`${this.branch}/getAll`)
    }
}
