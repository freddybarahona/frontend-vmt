import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { GenericResponse } from '../../core/interfaces/genericResponse';
import { Subject } from '../interfaces/subject';
import { UpdateSubjectRequest } from '../interfaces/update-subject-request';

@Service()
export class SubjectService {
    private http = inject(HttpClient)
    private api_url= environment.apiUrl
    private branch = `${this.api_url}/subjects`

    getAll(): Observable<GenericResponse<Subject[]>>{
        return this.http.get<GenericResponse<Subject[]>>(`${this.branch}/getAll`)
    }

    createSubject(name: string): Observable<GenericResponse<Subject>>{
        return this.http.post<GenericResponse<Subject>>(`${this.branch}/create`,{name: name})
    }

    updateSubject(req: UpdateSubjectRequest): Observable<GenericResponse<Subject>>{
        return this.http.put<GenericResponse<Subject>>(`${this.branch}/update/${req.SubjectId}`, req.name)
    }

    hardDeleteSubject(id: number): Observable<GenericResponse<Subject>>{
        return this.http.delete<GenericResponse<Subject>>(`${this.branch}/delete/${id}`)
    }
}
