import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { ProffesorDashboard } from './features/proffesor/pages/proffesor-dashboard';
import { AdministratorDashboard } from './features/administrator/pages/administrator-dashboard';
import { authGuard } from './core/guards/auth-guard';
import { StudentDashboardComponent } from './features/student/pages/student-dashboard/student-dashboard';

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
    component: StudentDashboardComponent,
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