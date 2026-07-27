import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { Grade } from '../../../student/interfaces/grade';
import { GradeService } from '../../../../shared/services/grade.service';
import { AuthService } from '../../../auth/services/auth-service';
import { CommonModule } from '@angular/common';
import { CreateGradeRequest } from '../../../../shared/interfaces/create-grade-request';
import { Router } from '@angular/router';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { SubjectService } from '../../../../shared/services/subject.service';
import { Subject } from '../../../../shared/interfaces/subject';

@Component({
  selector: 'app-proffesor-dashboard',
  imports: [
    CommonModule,
    ModalComponent,
  ],
  templateUrl: './proffesor-dashboard.html',
  styleUrl: './proffesor-dashboard.css',
})
export class ProffesorDashboard implements OnInit {
  private router = inject(Router)//es de angular/router no de express ese es para back
  private authService = inject(AuthService)
  private gradeService= inject(GradeService)
  private subjectService= inject(SubjectService)
  private cdr = inject(ChangeDetectorRef)
  public proffesorName = ''
  availableSubjects: Subject[] = []
  grades: Grade[] = []
  loading = signal(false)
  isModalOpen = false
  
  ngOnInit(): void {
    const proffesorId = this.authService.getUserId()
    this.proffesorName = this.authService.getUserName()
    this.obtenerGrade(proffesorId)
  }

  openModal(){
    this.verSubjectsDisponibles()
    this.isModalOpen = true  
  }
  
  closeModal(){
    this.isModalOpen = false
  }
  
  registerGrade(subjectId: number){
    const payload: CreateGradeRequest={
      subjectId: subjectId
    }
    this.gradeService.CreateGrade(payload).subscribe(
      response => {
        response.data
        this.obtenerGrade(this.authService.getUserId())
        this.closeModal()
      }
    )
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
  
  verEstudiantes(subjectId: number){
    this.router.navigate(['/proffesor','students',subjectId])// la coma es la la / de la ruta ( ' *')
    console.log('entre')
  }

  verSubjectsDisponibles(){
    //callback hell para pruebas esta es la version sencilla 
    this.subjectService.getAll().subscribe(subjectResponse =>{

      this.gradeService.getAllGrades().subscribe(gradeResponse => {
        
        const occupiedSubjects = gradeResponse.data.filter(grade => grade.role == 'PROFFESOR').map(grade => grade.idSubject)

        this.availableSubjects = subjectResponse.data.filter(subject => !occupiedSubjects.includes(subject.id))
        this.cdr.detectChanges()
      })
    })
  }
}
