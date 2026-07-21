import { HttpClient} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { environment } from '../../../../environments/environment.development';

import { GenericResponse } from '../../../core/interfaces/genericResponse';
import { Grade } from '../interfaces/grade';


@Injectable({
  providedIn: 'root'
})
export class GradeService {
    private http = inject(HttpClient)
    private apiUrl = environment.apiUrl
    private branch = `${this.apiUrl}/grades`
  
    getSubjectsByStudent(id: number): Observable<GenericResponse<Grade[]>> {
        return this.http.get<GenericResponse<Grade[]>>(
        `${this.branch}/get/${id}`
        )
    }
}
