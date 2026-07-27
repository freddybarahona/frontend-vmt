import { ChangeDetectorRef, Component, inject, OnInit, signal} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GradeService } from '../../../../shared/services/grade.service';
import { GetGradesBySubjectRequest } from '../../../../shared/interfaces/get-grades-by-subject-request';
import { GetGradesBySubjectDTO } from '../../../../shared/interfaces/get-grades-by-subjectDTO';
import { CommonModule, DatePipe } from '@angular/common';
import { UpdateGradeStudentRequest } from '../../../../shared/interfaces/update-grade-student-request';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subject-students',
  imports: [
    CommonModule,
    DatePipe,
    ModalComponent,
    FormsModule
  ],
  templateUrl: './subject-students.html',
  styleUrl: './subject-students.css',
})
export class SubjectStudents implements OnInit {
  private route = inject(ActivatedRoute)
  private gradeService= inject(GradeService)
  private cdr = inject(ChangeDetectorRef)
  
  selectedUser?: GetGradesBySubjectDTO 
  newScore = 0
  usersBySubject: GetGradesBySubjectDTO[] = [] 
  loading= signal(false) 
  isModalOpen= false
  ngOnInit(): void {
    const subjectId = Number(this.route.snapshot.paramMap.get('subjectId'))
    console.log(subjectId)
    this.obtenerGradesBySubject(subjectId, 3)
  }
  
  toggleModal(){
    if(!this.isModalOpen){
      
    }
    this.isModalOpen = !this.isModalOpen  //lo contrario
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
    this.selectedUser = user
    this.newScore = Number(user.score)
    this.toggleModal()
  }
  
  guardarNota(){
    if(!this.selectedUser) return
    const payload : UpdateGradeStudentRequest={
      subjectId: Number(this.route.snapshot.paramMap.get('subjectId')),
      studentId: this.selectedUser.idUser,
      score: this.newScore/* el valor ingresara del modal por ahora se quemara */
    }
    this.gradeService.updateGradeStudentByProf(payload).subscribe(response => {
      console.log(response.data)
      this.selectedUser!.score = String(this.newScore)
      this.toggleModal()
      this.cdr.detectChanges()
    })
  }
}
