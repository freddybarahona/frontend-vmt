import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { catchError, throwError } from 'rxjs';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID)
  if(!isPlatformBrowser(platformId)){
    return next(req)
  } 
  /* Si NO estoy en un navegador, no intentes acceder a 
  localStorage porque Node.js no lo tiene. 
  
  Angular SSR ejecuta este interceptor tanto en el servidor (Node.js)
  como en el navegador.

  localStorage solo existe en el navegador, por lo que verificamos
  primero que estemos ejecutándonos en Browser para evitar el error:

  "localStorage is not defined"
  */
  const token = localStorage.getItem('token')

  if (token) {

    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })

    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        //si el backend responde 401 con sesion activa -> el token expiro, fuera de sesion
        if (error.status === 401) {
          localStorage.removeItem('token')
          inject(Router).navigate(['/auth/login'])
        }
        return throwError(() => error)
      })
    );
  }

  return next(req);
};
