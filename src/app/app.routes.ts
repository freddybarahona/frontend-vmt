import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { ProffesorDashboard } from './features/proffesor/pages/proffesor-dashboard';
import { StudentDashboard } from './features/student/pages/student-dashboard/student-dashboard';
import { AdministratorDashboard } from './features/administrator/pages/administrator-dashboard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'proffesor',
    component: ProffesorDashboard
  },
  {
    path: 'student',
    component: StudentDashboard
  },
  {
  path: 'admin',
  component: AdministratorDashboard
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];