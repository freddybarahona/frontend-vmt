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
    renderMode: RenderMode.Server
    //renderMode: RenderMode.Prerender
  }
];
