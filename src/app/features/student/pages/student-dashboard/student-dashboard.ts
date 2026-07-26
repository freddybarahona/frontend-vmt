import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { GradeService } from '../../../../shared/services/grade.service';
import { AuthService } from '../../../auth/services/auth-service';
import { Grade } from '../../interfaces/grade';

@Component({
  selector: 'app-student-dashboard',
  imports: [CommonModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css',
})
export class StudentDashboardComponent implements OnInit {

  private gradeService = inject(GradeService)
  private authService = inject(AuthService)
  public studentName = ''
  grades: Grade[] = [];
  loading = signal(false)

  ngOnInit(): void {

    const studentId = this.authService.getUserId()
    this.studentName = this.authService.getUserName()
    this.obtenerMaterias(studentId)
    
  }

  obtenerMaterias(id: number){
    this.loading.set(true)
    this.gradeService
      .getGradesByUser(id)
      .subscribe(response =>{
          this.loading.set(false)
          console.log('Response:', response)
          this.grades = response.data;
      })
  }
}
