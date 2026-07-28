import { Component, inject, OnInit, signal } from '@angular/core';
import { SubjectService } from '../../../shared/services/subject.service';
import { Subject } from '../../../shared/interfaces/subject';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { AuthService } from '../../auth/services/auth-service';
import { GradeService } from '../../../shared/services/grade.service';
import { forkJoin } from 'rxjs';
import { UserService } from '../../../shared/services/user.service';
import { SubjectProffesor } from '../../../shared/interfaces/subject-proffesor';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    //ModalComponent,
  ],
  templateUrl: './administrator-dashboard.html',
  styleUrl: './administrator-dashboard.css',
})
export class AdministratorDashboard implements OnInit {
  private subjectService = inject(SubjectService)
  private authService = inject(AuthService)
  private GradeService = inject(GradeService)
  private UserService = inject(UserService) 
  public adminName = ''
  subjectsAvailable: SubjectProffesor[] =[]
  loading = signal(false)
  
  ngOnInit(): void {
    this.adminName = this.authService.getUserName()
    this.obtenerMaterias()
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
          proffesorName: proffesor?.name ?? 'sin asignar'
        }
      })
      this.loading.set(false)
      console.log(subjectsWithProffesor) 
      this.subjectsAvailable= subjectsWithProffesor

    })
  }
}
