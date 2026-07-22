import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { authGuard } from './core/guards/auth-guard';
export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes')
  },
  {
    path: 'proffesor',
    canActivate: [authGuard],
    loadChildren: () => //lazy loading mejor opcion
      import('./features/proffesor/proffesor.routes')
  },
  {
    path: 'student',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/student/student.routes')
  },
  {
    path: 'administrator',
    canActivate: [authGuard],
    loadChildren: () => 
      import('./features/administrator/administrator.routes')
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '' //mas practico
  }
]

/* 
VERSION POCO ESCALABLE:
{
  path: 'administrator',
  component: AdministratorDashboard,
  canActivate: [authGuard]
} 
VERSION MUY ESCALABLE:
{
  path: 'proffesor',
  canActivate: [authGuard],
  loadChildren: () => 
    import('./features/proffesor/proffesor.routes')
}


el children: carga todas las rutas alarrancart la app
el loadChildren: hace lazy loading haceindo que se carguen los elementos solo cuando se entre al componente

*/