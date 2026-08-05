import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
/*   {
    path: 'administrator',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'student',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'proffesor',
    renderMode: RenderMode.Prerender
  }, */
  {
    path: '**',
    renderMode: RenderMode.Server //esto significa que Esta ruta debe renderizarse en el servidor cada vez que alguien la solicite
    //renderMode: RenderMode.Prerender
  }
];

/* 
RenderMode.Server
Usuario pide página
        |
        v
Render recibe petición
        |
        v
Node ejecuta Angular SSR
        |
        v
Genera HTML
        |
        v
Lo envía al navegador
*/