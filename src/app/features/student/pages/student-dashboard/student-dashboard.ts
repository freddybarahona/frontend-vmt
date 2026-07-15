import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { SubjectService } from '../../services/subject.service';
import { Subject } from '../../interfaces/subject';
import { AuthService } from '../../../auth/services/auth-service';

@Component({
  selector: 'app-student-dashboard',
  imports: [CommonModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css',
})
export class StudentDashboardComponent implements OnInit {

  private subjectService = inject(SubjectService)
  private authService = inject(AuthService)
  subjects: Subject[] = [];
  loading = signal(false)

  ngOnInit(): void {

    let studentId = this.authService.getUserId()
    if(studentId == null){
      studentId= 0
    }

    this.obtenerMaterias(studentId)
    
  }

  obtenerMaterias(id: number){
    this.loading.set(true)
    this.subjectService
      .getSubjectsByStudent(id)
      .subscribe(response =>{
          this.loading.set(false)
          console.log('Response:', response)
          this.subjects = response.data;
      })
  }
}
