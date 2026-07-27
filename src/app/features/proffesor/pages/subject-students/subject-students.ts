import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GradeService } from '../../../../shared/services/grade.service';
import { Grade } from '../../../student/interfaces/grade';
import { response } from 'express';
import { GetGradesBySubjectRequest } from '../../../../shared/interfaces/get-grades-by-subject-request';

@Component({
  selector: 'app-subject-students',
  imports: [],
  templateUrl: './subject-students.html',
  styleUrl: './subject-students.css',
})
export class SubjectStudents implements OnInit {
  private route = inject(ActivatedRoute)
  private gradeService= inject(GradeService)
  studentsBySubject: Grade[] = []  
  ProffesorBySubject: Grade[] = []  
  ngOnInit(): void {
    const subjectId = Number(this.route.snapshot.paramMap.get('subjectId'))
    console.log(subjectId)
    this.obtenerGradesBySubject(subjectId, 3)
  }

  obtenerGradesBySubject(subjectId: number, roleUsers: number){
    const payload: GetGradesBySubjectRequest={
      subjectId: subjectId,
      role: roleUsers
    }
    this.gradeService.getGradesBySubject(payload).subscribe(response =>{
      this.studentsBySubject= response.data
      console.log(response)
    } 
    )

  }



}
