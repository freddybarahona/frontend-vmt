import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { environment } from '../../../../environments/environment';
import { GenericResponse } from '../../../core/interfaces/genericResponse';
import { User } from '../../../user';
import { CreateUserRequest } from '../../../shared/interfaces/create-user-request';
import { LoginRequest } from '../../../login-request';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core'
import { CorreoCodigoVerificacionRequest } from '../../../shared/interfaces/correo-codigo-verificacion-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  private branch = `${this.apiUrl}/auth`;
  private platformId= inject(PLATFORM_ID);
  private flagVerifyCode= false
  constructor(
    private http: HttpClient
  ) {}

  setFlagVerifyCode(value: boolean){
    this.flagVerifyCode= value
  }

  getFlagVerifyCode(){
    return this.flagVerifyCode
  }

  login(req: LoginRequest): Observable<any> {
    return this.http.post(`${this.branch}/login`,req)
  }

  createUser(req: CreateUserRequest): Observable<GenericResponse<User>>{
    return this.http.post<GenericResponse<User>>(`${this.branch}/create`, req)
  }

  correoCodigoVerificacion(req: CorreoCodigoVerificacionRequest): Observable<GenericResponse<void>>{
    return this.http.post<GenericResponse<void>>(`${this.branch}/request-verification`, req)
  }

  verifyCode(code: number):Observable<GenericResponse<void>>{
    return this.http.post<GenericResponse<void>>(`${this.branch}/verify-code`, {code: code})
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getPayload(): JwtPayload | null {

    const token = this.getToken();

    if (!token) {
      return null;
    }

    return jwtDecode<JwtPayload>(token);
  }

  getRole(): string | null {
    return this.getPayload()?.role ?? null;
  }

  getUserId(): number{
    const id =this.getPayload()?.id ?? 0;
    
    return id
  }

  getUserName(): string{
    let name =this.getPayload()?.name ?? '******';
    return name
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}