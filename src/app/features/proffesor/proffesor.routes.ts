import { Routes } from '@angular/router';
import { ProffesorDashboard } from './pages/Proffesor-dashboard/proffesor-dashboard';
import { SubjectStudents } from './pages/subject-students/subject-students';

export default [
  {
    path:'',
    component: ProffesorDashboard
  },
  {
    path: 'students/:subjectId',
    component: SubjectStudents
  }
] as Routes
