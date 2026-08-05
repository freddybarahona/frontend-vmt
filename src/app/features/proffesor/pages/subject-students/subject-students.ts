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
  
  selectedUser?: GetGradesBySubjectDTO 
  newScore = 0
  usersBySubject= signal<GetGradesBySubjectDTO[]>([]) 
  loading= signal(false) 
  isModalOpen= signal(false)
  public errors_back = signal<string[]>([])
  ngOnInit(): void {
    const subjectId = Number(this.route.snapshot.paramMap.get('subjectId'))
    console.log(subjectId)
    this.obtenerGradesBySubject(subjectId, 3)
  }
  
  toggleModal(){
    if(!this.isModalOpen){
      
    }
    this.isModalOpen.set(!this.isModalOpen)  //lo contrario
  }

  obtenerGradesBySubject(subjectId: number, roleUsers: number){
    this.loading.set(true)
    const payload: GetGradesBySubjectRequest={
      subjectId: subjectId,
      role: roleUsers
    }
    this.gradeService.getGradesBySubject(payload).subscribe(
      {next: (response) =>{
        this.usersBySubject.set(response.data)
        console.log(response)
        this.loading.set(false)
      },error: (error) =>{
        this.errors_back.set(error.error.errors[0])

        this.loading.set(false)
      }
    })
  }



  editarNota(user: GetGradesBySubjectDTO){// etapa 1 entra, guarda el usuario, guarda la nota actual, abre el modal 
    this.selectedUser = user
    this.newScore = Number(user.score)
    this.toggleModal()
  }
  
  guardarNota(){// etapa 2 verifica que se ingrese algo y si no retorna, rellena el payload, actualiza la nota, cierra modal y detecta los cambios 
    if(!this.selectedUser) return
    const payload : UpdateGradeStudentRequest={
      subjectId: Number(this.route.snapshot.paramMap.get('subjectId')),
      studentId: this.selectedUser.idUser,
      score: this.newScore/* el valor ingresara del modal por ahora se quemara */
    }
    this.gradeService.updateGradeStudentByProf(payload).subscribe({next: (response) => {
      console.log(response.data)
      this.selectedUser!.score = String(this.newScore)
      this.toggleModal()
    },error: (error) => {
      this.errors_back.set(error.error.errors[0])
    }
  })
  }
}
