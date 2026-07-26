import { HttpClient} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { GenericResponse } from '../../core/interfaces/genericResponse';
import { Grade } from '../../features/student/interfaces/grade';
import { CreateGradeRequest } from '../interfaces/create-grade-request';
import { GetGradesBySubjectRequest } from '../interfaces/get-grades-by-subject-request';
import { UpdateGradeStudentRequest } from '../interfaces/update-grade-student-request';


@Injectable({
  providedIn: 'root'
})
export class GradeService {
    private http = inject(HttpClient)
    private apiUrl = environment.apiUrl
    private branch = `${this.apiUrl}/grades`
    
    getAllGrades(): Observable<GenericResponse<Grade[]>>{
      return this.http.get<GenericResponse<Grade[]>>(`${this.branch}/getAll`)
    }
    
    CreateGrade(request: CreateGradeRequest): Observable<GenericResponse<Grade>>{
      return this.http.post<GenericResponse<Grade>>(`${this.branch}/create`,request)
    }
    
    logicDeleteGrade(grade: number): Observable<GenericResponse<Grade[]>>{
      return this.http.put<GenericResponse<Grade[]>>(`${this.branch}/delete/`,grade)
    }

    updateGradeStudentByProf(request: UpdateGradeStudentRequest): Observable<GenericResponse<Grade>>{
      return this.http.patch<GenericResponse<Grade>>(`${this.branch}/update/${request.subjectId}/${request.studentId}`,request.score)
    }

    getGradesBySubject(request: GetGradesBySubjectRequest): Observable<GenericResponse<Grade[]>>{
      return this.http.get<GenericResponse<Grade[]>>(`${this.branch}/get/${request.subjectId}/${request.role}`)
    }

    getGradesByUser(id: number): Observable<GenericResponse<Grade[]>> {
        return this.http.get<GenericResponse<Grade[]>>(`${this.branch}/get/${id}`)
    }

}
