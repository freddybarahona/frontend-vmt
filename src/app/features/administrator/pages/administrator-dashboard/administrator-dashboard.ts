import { Component, inject, OnInit, signal } from '@angular/core';
import { SubjectService } from '../../../../shared/services/subject.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { AuthService } from '../../../auth/services/auth-service';
import { GradeService } from '../../../../shared/services/grade.service';
import { forkJoin } from 'rxjs';
import { UserService } from '../../../../shared/services/user.service';
import { SubjectProffesor } from '../../../../shared/interfaces/subject-proffesor';
import { LogicDeleteAdminGradeRequest } from '../../../../shared/interfaces/logic-delete-admin-grade-request';
import { GetGradesBySubjectRequest } from '../../../../shared/interfaces/get-grades-by-subject-request';
import { GetGradesBySubjectDTO } from '../../../../shared/interfaces/get-grades-by-subjectDTO';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  private router = inject(Router)
  private subjectService = inject(SubjectService)
  private authService = inject(AuthService)
  private GradeService = inject(GradeService)
  private UserService = inject(UserService)
  isModalOpen=false
  public adminName = ''
  subjectsAvailable= signal<SubjectProffesor[]>([])
  selectedSubject: LogicDeleteAdminGradeRequest | null= null;// para el modal de liberar
  loading = signal(false)
  loadingstudents= signal(false)
  expandedSubjectId: number | null = null
  studentsBySubject= signal<Record<number, GetGradesBySubjectDTO[]>> ({})
  modalTitle = '';
  modalType: 'create' | 'delete P' | 'delete S' | null = null;
  newSubjectName: string= ''
  errors_back= signal<string[]>([])
  
  ngOnInit(): void {
    this.adminName = this.authService.getUserName()
    this.obtenerMaterias()
  }
  
  crearUsuario(){
    this.router.navigate(['administrator/createUser'])
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
    this.GradeService.getGradesBySubject(payload).subscribe({next: (response) => {
        this.studentsBySubject.update(current => ({...current,[subjectId]: response.data}))
        //reemplaza a this.studentsBySubject[subjectId] = response.data
        this.loadingstudents.set(false)
      },error: (error)=>{
        this.loadingstudents.set(false)
      }
    })
  }


  toggleModal(){
    this.isModalOpen = !this.isModalOpen
    console.log(this.isModalOpen)
  }

  openCreateModal(){
    this.modalType='create'
    this.modalTitle='Ingrese el nombre de la nueva materia'
    this.toggleModal()
  }
  
  crearMateria(name: string){
    this.loading.set(true)
    this.subjectService.createSubject(name).subscribe({next: (response) => {
        this.obtenerMaterias()
        this.loading.set(false)
        this.toggleModal()
        this.newSubjectName=''
      },error: (error)=> {
        this.loading.set(false)
        this.errors_back.set(error.error.errors[0])
        this.newSubjectName=''
      }
    })    
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

  openBorrarMateriaModal(idsubject: number, subjectName: string){
    this.modalType= 'delete S'
    this.modalTitle= 'Borrado de materia'
    const pase: LogicDeleteAdminGradeRequest={
      idSubject: idsubject,
      subjectName: subjectName,
      idUser: 0,
      proffesorName: ''
    }
    this.selectedSubject = pase
    this.toggleModal()
  }

  borrarMateria(){
    this.subjectService.hardDeleteSubject(this.selectedSubject!.idSubject).subscribe({next: (response) =>{
      this.obtenerMaterias()
      this.toggleModal()
    },error: (error) =>{
      this.loading.set(false)
      this.errors_back.set(error.error.errors[0])
    }})
  }

  borrarGrade(){
    const payload: LogicDeleteAdminGradeRequest={
      idUser: Number(this.selectedSubject?.idUser),
      idSubject: Number(this.selectedSubject?.idSubject),
      subjectName: this.selectedSubject!.subjectName,
      proffesorName: this.selectedSubject!.proffesorName
    }
    this.GradeService.logicDeleteAdminGrade(payload).subscribe(response => {
      //console.log(response.data)
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
    }).subscribe({next: ({subjects, grades, users}) =>{
      const subjectsData= subjects.data ?? [] //filtro para entrada de datos limpios en caso de retornar nulo se cambia a un array vacio para todos
      const gradesData = grades.data ?? [] 
      const usersData = users.data ?? []

      const subjectsWithProffesor = subjectsData.map(subject => { 
        //busca el registro de profesor para esta materia 
        const subjectOccupied= gradesData.find(grade => grade.idSubject == subject.id && grade.role == 'PROFFESOR')
        //busca el usuario profesor
        //find devuelve tipo de dato | undefined
        //fiter devuelve tipo de dato
        const proffesor = usersData.find( user => user.id == subjectOccupied?.idUser)
        //console.log(proffesor)

        return{//construye el objeto a guarda en subjectWithProffesor
          id: subject.id,
          subjectName: subject.name,
          idUser: proffesor?.id ?? 0,
          proffesorName: proffesor?.name ?? 'sin asignar'
        }
      })
      this.loading.set(false)
      this.subjectsAvailable.set(subjectsWithProffesor.sort((a,b) => a.id - b.id))//procedo a ordenar por id de materia, para que se vea mas ordenado
      console.log(subjectsWithProffesor)
      },error: (error) =>{ 
        this.loading.set(false)
        this.errors_back.set(error.error.errors[0])

      }
      
    })
  }
  
}
//el forkJoin trabaja de manera particular no es facil trabajar con los errores:
/* esto se debe a que como son 3 subscribe a la vez si 1 minimo entra con un ok entonces nunca entrara en error y queda en un bucle raro
por eso hay que ponerlos en los casos que convengan como todos ok o todos error en el caso de que */

/* 
mira esto:
studentsBySubject: Record<number, GetGradesBySubjectDTO[]> ={}

se lo rellena asi:
this.studentsBySubject[subjectId] = response.data

esto es su version primitiva, pero no es reactivo, por lo que no se actualiza la vista cuando se cambia su valor. 

studentsBySubject: {
  [key: number]: GetGradesBySubjectDTO[]
} = {}


y esto visualmente seria esto 

studentsBySubject = {
  1: [
    { idUser: 10, nameUser: 'Juan' },
    { idUser: 11, nameUser: 'Pedro' }
  ],
  2: [
    { idUser: 15, nameUser: 'Maria' }
  ]
}

es un objeto que guarda un arreglo de estudiantes para cada materia.
*/
