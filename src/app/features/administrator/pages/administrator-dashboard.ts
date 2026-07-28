import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { SubjectService } from '../../../shared/services/subject.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { AuthService } from '../../auth/services/auth-service';
import { GradeService } from '../../../shared/services/grade.service';
import { forkJoin } from 'rxjs';
import { UserService } from '../../../shared/services/user.service';
import { SubjectProffesor } from '../../../shared/interfaces/subject-proffesor';
import { LogicDeleteAdminGradeRequest } from '../../../shared/interfaces/logic-delete-admin-grade-request';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    ModalComponent,
  ],
  templateUrl: './administrator-dashboard.html',
  styleUrl: './administrator-dashboard.css',
})
export class AdministratorDashboard implements OnInit {
  private subjectService = inject(SubjectService)
  private authService = inject(AuthService)
  private GradeService = inject(GradeService)
  private UserService = inject(UserService)
  private cdr = inject(ChangeDetectorRef) 
  isModalOpen=false
  public adminName = ''
  subjectsAvailable: SubjectProffesor[] =[]
  selectedSubject: LogicDeleteAdminGradeRequest | null= null;// para el modal de liberar
  loading = signal(false)
  
  ngOnInit(): void {
    this.adminName = this.authService.getUserName()
    this.obtenerMaterias()
  }

  toggleModal(){
    this.isModalOpen = !this.isModalOpen
  }

  openLiberarModal(subject: SubjectProffesor){
    const pase: LogicDeleteAdminGradeRequest={
      idUser: subject.idUser,
      idSubject: subject.id,
      subjectName: subject.subjectName,
      proffesorName: subject.proffesorName
    }
    this.selectedSubject = pase
    this.isModalOpen=true
  }

  borrarGrade(){
    const payload: LogicDeleteAdminGradeRequest={
      idUser: Number(this.selectedSubject?.idUser),
      idSubject: Number(this.selectedSubject?.idSubject),
      subjectName: this.selectedSubject!.subjectName,
      proffesorName: this.selectedSubject!.proffesorName
    }
    this.GradeService.logicDeleteAdminGrade(payload).subscribe(response => {
      console.log(response.data)
      this.toggleModal()
      this.obtenerMaterias()

    })
  }

  obtenerMaterias(){
    this.loading.set(true)
    forkJoin({
      subjects: this.subjectService.getAll(),
      grades: this.GradeService.getAllGrades(),
      users: this.UserService.getAll()
    }).subscribe(({subjects, grades, users}) =>{
      const subjectsWithProffesor = subjects.data.map(subject => { 
        //busca el registro de profesor para esta materia 
        const subjectOccupied= grades.data.find(grade => grade.idSubject == subject.id && grade.role == 'PROFFESOR')
        //busca el usuario profesor
        //find devuelve tipo de dato | undefined
        //fiter devuelve tipo de dato
        const proffesor = users.data.find( user => user.id == subjectOccupied?.idUser)
        console.log(proffesor)

        return{//construye el objeto a guarda en subjectWithProffesor
          id: subject.id,
          subjectName: subject.name,
          idUser: proffesor?.id ?? 0,
          proffesorName: proffesor?.name ?? 'sin asignar'
        }
      })
      this.loading.set(false)
      console.log(subjectsWithProffesor) 
      this.subjectsAvailable= subjectsWithProffesor

    })
  }
}
