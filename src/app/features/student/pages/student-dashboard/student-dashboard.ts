import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { GradeService } from '../../../../shared/services/grade.service';
import { AuthService } from '../../../auth/services/auth-service';
import { Grade } from '../../interfaces/grade';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { SubjectService } from '../../../../shared/services/subject.service';
import { Subject } from '../../../../shared/interfaces/subject';
import { forkJoin } from 'rxjs';
import { CreateGradeRequest } from '../../../../shared/interfaces/create-grade-request';

@Component({
  selector: 'app-student-dashboard',
  imports: [
    CommonModule,
    ModalComponent
  ],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css',
})
export class StudentDashboardComponent implements OnInit {

  private gradeService = inject(GradeService)
  private SubjectService = inject(SubjectService)
  private authService = inject(AuthService)
  public studentName = ''
  public error_back = signal<string[]>([])
  private cdr = inject(ChangeDetectorRef)
  isModalOpen = false
  availableSubjects: Subject[] = []
  grades= signal<Grade[]>([])
  loading = signal(false)

  ngOnInit(): void {
    const studentId = this.authService.getUserId()
    this.studentName = this.authService.getUserName()
    this.obtenerMaterias(studentId)
  }

  toggleModal(){
    if(!this.isModalOpen){
      this.verSubjectsDisponibles()
    }
    this.isModalOpen = !this.isModalOpen  //lo contrario
  }

  verSubjectsDisponibles(){
    forkJoin({
      subjects: this.SubjectService.getAll(),
      grades: this.gradeService.getAllGrades()
    }).subscribe(({subjects, grades})/* destructuring */ => { 
      const studentId = this.authService.getUserId()
      const UserGrades= grades.data
        .filter( grade => grade.idUser == studentId && grade.role == 'STUDENT')
        .map(grade => grade.idSubject)
        console.log("materias del usuario",UserGrades)

      const gradesWithProffesor= grades.data
        .filter( grade => grade.role == 'PROFFESOR')
        .map(grades => grades.idSubject)

      console.log('materias del usuario con profesor', gradesWithProffesor)
      this.availableSubjects= subjects.data
        .filter(subject => !UserGrades.includes(subject.id) && gradesWithProffesor.includes(subject.id) ) 
        console.log(this.availableSubjects)
        this.cdr.detectChanges()
    })
  }

  registerGrade(subjectId: number){
    console.log('CLICK REGISTRAR', subjectId)
    const payload: CreateGradeRequest ={
      subjectId: subjectId
    } 
    this.gradeService.CreateGrade(payload).subscribe(response =>{
      this.obtenerMaterias(this.authService.getUserId())
      console.log(response)
      this.toggleModal()
    })

    
  }

  obtenerMaterias(id: number){
    this.loading.set(true)
    this.gradeService
      .getGradesByUser(id)
      .subscribe({next: (response) =>{
          this.loading.set(false)
          console.log('Response:', response)
          this.grades.set(response.data)
      },error: (error) =>{
          this.loading.set(false)
          this.error_back.set(error.error.errors[0])
      }
    })
  }
}
