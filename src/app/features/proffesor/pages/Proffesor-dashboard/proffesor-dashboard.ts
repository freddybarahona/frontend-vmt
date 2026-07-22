import { Component, inject, OnInit, signal } from '@angular/core';
import { Grade } from '../../../student/interfaces/grade';
import { GradeService } from '../../../student/services/grade.service';
import { AuthService } from '../../../auth/services/auth-service';
import { CommonModule } from '@angular/common';
import { CreateGradeRequest } from '../../../../shared/interfaces/create-grade-request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proffesor-dashboard',
  imports: [CommonModule],
  templateUrl: './proffesor-dashboard.html',
  styleUrl: './proffesor-dashboard.css',
})
export class ProffesorDashboard implements OnInit {
  private router = inject(Router)//es de angular/router no de express ese es para back
  private gradeService= inject(GradeService)
  private authService = inject(AuthService)
  public proffesorName = ''
  grades: Grade[] = []
  loading = signal(false)
  
  ngOnInit(): void {
    const proffesorId = this.authService.getUserId()
    this.proffesorName = this.authService.getUserName()
    this.obtenerGrade(proffesorId)
  }

  obtenerGrade(id: number){
    this.loading.set(true)
    this.gradeService.getGradesByUser(id).subscribe(
      response => {
        this.loading.set(false)
        console.log('Response:', response)
        this.grades = response.data
      }
    )
  }

  crearGrade(){
    this.loading.set(true)
    const request: CreateGradeRequest = {
      subjectId: 6
    }

    this.gradeService.CreateGrade(request).subscribe(
      response => {
        this.loading.set(false)
        console.log('Response', response)
        this.grades.push(response.data)
      }
    )
  }
  
  verEstudiantes(subjectId: number){
    this.router.navigate(['/proffesor','students',subjectId])
  }
}
