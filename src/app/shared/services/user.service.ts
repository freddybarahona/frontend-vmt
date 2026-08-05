import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment'; //siempre ingresa a el environment de prod porque angular se encargara de cambiar entre environment
import { User } from '../../user';
import { GenericResponse } from '../../core/interfaces/genericResponse';
import { Observable } from 'rxjs';
import { UpdateUserRequest } from '../interfaces/update-user-request';
import { UpdatePasswordRequest } from '../interfaces/update-password-request';

@Service()
export class UserService {
    private http = inject(HttpClient)
    private apiUrl = environment.apiUrl
    private branch = `${this.apiUrl}/users`

    getAll(): Observable<GenericResponse<User[]>>{
        return this.http.get<GenericResponse<User[]>>(`${this.branch}/get`,)
    }

    searchUser(value: string): Observable<GenericResponse<User[]>>{
        const params = new HttpParams().set('value',value)
        return this.http.get<GenericResponse<User[]>>(`${this.branch}/search`, {params})
    }

    updateUser(req: UpdateUserRequest, Userid: number): Observable<GenericResponse<User>>{
        return this.http.put<GenericResponse<User>>(`${this.branch}/update/${Userid}`, req)
    }

    updatePassword(req: UpdatePasswordRequest): Observable<GenericResponse<{}>>{
        return this.http.put<GenericResponse<{}>>(`${this.branch}/update/${req.userId}`, req.password)
    }

    hardDeleteUser(userId: number): Observable<GenericResponse<User>>{
        return this.http.delete<GenericResponse<User>>(`${this.branch}/delete/${userId}`)
    }

}
