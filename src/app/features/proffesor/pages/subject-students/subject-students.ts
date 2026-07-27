import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GradeService } from '../../../../shared/services/grade.service';
import { Grade } from '../../../student/interfaces/grade';
import { GetGradesBySubjectRequest } from '../../../../shared/interfaces/get-grades-by-subject-request';
import { GetGradesBySubjectDTO } from '../../../../shared/interfaces/get-grades-by-subjectDTO';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-subject-students',
  imports: [
    CommonModule,
    DatePipe
  ],
  templateUrl: './subject-students.html',
  styleUrl: './subject-students.css',
})
export class SubjectStudents implements OnInit {
  private route = inject(ActivatedRoute)
  private gradeService= inject(GradeService)
  usersBySubject: GetGradesBySubjectDTO[] = [] 
  loading= signal(false) 
  ngOnInit(): void {
    const subjectId = Number(this.route.snapshot.paramMap.get('subjectId'))
    console.log(subjectId)
    this.obtenerGradesBySubject(subjectId, 3)
  }

  obtenerGradesBySubject(subjectId: number, roleUsers: number){
    this.loading.set(true)
    const payload: GetGradesBySubjectRequest={
      subjectId: subjectId,
      role: roleUsers
    }
    this.gradeService.getGradesBySubject(payload).subscribe(response =>{

      this.usersBySubject= response.data
      console.log(response)
      this.loading.set(false)
    })
  }
}
