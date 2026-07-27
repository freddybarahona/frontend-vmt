import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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

    return next(authReq);
  }

  return next(req);
};
