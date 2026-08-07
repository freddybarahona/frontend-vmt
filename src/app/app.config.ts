import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), 
    //provideClientHydration(),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};

/* el client hydration funciona asi
¿Qué hace provideClientHydration()?

Cuando usas SSR:

El servidor genera el HTML.
El navegador recibe ese HTML ya renderizado.
Angular intenta "conectarse" a ese HTML existente sin volver a renderizarlo.

A ese proceso se le llama hydration.

HTML generado en servidor
=
HTML generado en navegador
aparece:

NG0500
Hydration mismatch

y Angular puede dejar componentes en un estado raro. 

por eso es que explota por conflicto entre la clonacion del servidor y la actualizacion del hydration

Opción 1 (rápida)

Dejar:

provideClientHydration()

comentado.

La aplicación seguirá funcionando.

Muchos proyectos SSR pequeños hacen esto mientras desarrollan.

Opción 2 (la correcta)

Encontrar qué componente genera HTML diferente entre servidor y navegador.

nos quedaremos con la opcion 1 por ahora despues corregimos esto de la forma correcta

*/