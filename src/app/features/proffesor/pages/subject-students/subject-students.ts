import { ChangeDetectorRef, Component, inject, OnInit, signal} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GradeService } from '../../../../shared/services/grade.service';
import { GetGradesBySubjectRequest } from '../../../../shared/interfaces/get-grades-by-subject-request';
import { GetGradesBySubjectDTO } from '../../../../shared/interfaces/get-grades-by-subjectDTO';
import { CommonModule, DatePipe } from '@angular/common';
import { UpdateGradeStudentRequest } from '../../../../shared/interfaces/update-grade-student-request';

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
  private cdr = inject(ChangeDetectorRef)
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

  editarNota(user: GetGradesBySubjectDTO){
    console.log(user)
    const payload : UpdateGradeStudentRequest={
      subjectId: Number(this.route.snapshot.paramMap.get('subjectId')),
      studentId: user.idUser,
      score: 0/* el valor ingresara del modal por ahora se quemara */
    }
    this.gradeService.updateGradeStudentByProf(payload).subscribe(response => {
      console.log(response.data)
      user.score = String(payload.score)
      this.cdr.detectChanges()
    })
  }
}
