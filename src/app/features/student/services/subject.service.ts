import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable} from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Subject } from '../interfaces/subject';

@Service()
export class SubjectService {
    private http = inject(HttpClient)
    private apiUrl = environment.apiUrl
    private branch = `${this.apiUrl}/subjects`

    getSubjectsByStudent(id: number): Observable<Subject[]> {
        return this.http.get<Subject[]>(
        `${this.branch}/student/${id}`
        )
    }
}
