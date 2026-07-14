import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { ProffesorDashboard } from './features/proffesor/pages/proffesor-dashboard';
import { StudentDashboard } from './features/student/pages/student-dashboard/student-dashboard';
import { AdministratorDashboard } from './features/administrator/pages/administrator-dashboard';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'proffesor',
    component: ProffesorDashboard,
    canActivate: [authGuard]
  },
  {
    path: 'student',
    component: StudentDashboard,
    canActivate: [authGuard]
    
  },
  {
    path: 'administrator',
    component: AdministratorDashboard,
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];