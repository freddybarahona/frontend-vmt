import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { GradeService } from '../../services/grade.service';
import { Subject } from '../../interfaces/subject';
import { AuthService } from '../../../auth/services/auth-service';
import { JwtPayload } from 'jwt-decode';

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
  subjects: Subject[] = [];
  loading = signal(false)

  ngOnInit(): void {

    let studentId = this.authService.getUserId()
    this.studentName = this.authService.getUserName()
    this.obtenerMaterias(studentId)
    
  }

  obtenerMaterias(id: number){
    this.loading.set(true)
    this.gradeService
      .getSubjectsByStudent(id)
      .subscribe(response =>{
          this.loading.set(false)
          console.log('Response:', response)
          this.subjects = response.data;
      })
  }
}
