import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { SubjectService } from '../../../shared/services/subject.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { AuthService } from '../../auth/services/auth-service';
import { GradeService } from '../../../shared/services/grade.service';
import { forkJoin } from 'rxjs';
import { UserService } from '../../../shared/services/user.service';
import { SubjectProffesor } from '../../../shared/interfaces/subject-proffesor';
import { LogicDeleteAdminGradeRequest } from '../../../shared/interfaces/logic-delete-admin-grade-request';
import { User } from '../../../user';
import { response } from 'express';
import { GetGradesBySubjectRequest } from '../../../shared/interfaces/get-grades-by-subject-request';
import { GetGradesBySubjectDTO } from '../../../shared/interfaces/get-grades-by-subjectDTO';
import { error } from 'console';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    DatePipe,
    ModalComponent,
    FormsModule
  ],
  templateUrl: './administrator-dashboard.html',
  styleUrl: './administrator-dashboard.css',
})
export class AdministratorDashboard implements OnInit {
  private subjectService = inject(SubjectService)
  private authService = inject(AuthService)
  private GradeService = inject(GradeService)
  private UserService = inject(UserService)
  isModalOpen=false
  public adminName = ''
  subjectsAvailable: SubjectProffesor[] =[]
  selectedSubject: LogicDeleteAdminGradeRequest | null= null;// para el modal de liberar
  loading = signal(false)
  loadingstudents= signal(false)
  expandedSubjectId: number | null = null
  studentsBySubject: Record<number, GetGradesBySubjectDTO[]> ={}
  modalTitle = '';
  modalType: 'create' | 'delete P' | null = null;
  newSubjectName: string= ''

  ngOnInit(): void {
    this.adminName = this.authService.getUserName()
    this.obtenerMaterias()
  }

  toggleSubject(subjectId: number){
    
    if(this.expandedSubjectId == subjectId){
      this.expandedSubjectId = null
      return
    }
    this.expandedSubjectId = subjectId
    this.obtenerStudentsBySubject(this.expandedSubjectId)
    return 
  }

  obtenerStudentsBySubject(subjectId: number){
    this.loadingstudents.set(true)
    const payload: GetGradesBySubjectRequest={
      subjectId: subjectId,
      role: 3
    }
    this.GradeService.getGradesBySubject(payload).subscribe(response => {
      this.studentsBySubject[subjectId]= response.data
      console.log(this.studentsBySubject)
      this.loadingstudents.set(false)
    },error=>{
      this.loadingstudents.set(false)
    }
  )}


  toggleModal(){
    this.isModalOpen = !this.isModalOpen
  }

  openCreateModal(){
    this.modalType='create'
    this.modalTitle='Ingrese el nombre de la nueva materia'
    this.toggleModal()
  }
  
  crearMateria(name: string){
    this.loading.set(true)
    this.subjectService.createSubject(name).subscribe(response => {
      this.obtenerMaterias()
      this.loading.set(false)
      this.toggleModal()
      this.newSubjectName=''
    },error=> {
      this.loading.set(false)
      this.toggleModal()
      this.newSubjectName=''
    }
    )    
  }
  openLiberarModal(subject: SubjectProffesor){
    this.modalType= 'delete P'
    this.modalTitle= 'Liberacion de materia'
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
