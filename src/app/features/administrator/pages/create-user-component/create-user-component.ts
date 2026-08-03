import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth-service';
import { CorreoCodigoVerificacionRequest } from '../../../../shared/interfaces/correo-codigo-verificacion-request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user-component',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './create-user-component.html',
  styleUrl: './create-user-component.css',
})
export class CreateUserComponent{

  private router = inject(Router)
  private authService= inject(AuthService)
  public showPassword = false
  public nombre = ''
  public email = ''
  public password= ''
  public repeatPassword= ''
  public showRepeatPassword = false
  public identificacion = ''
  public selectedRole: 'STUDENT' | 'PROFFESOR' | "" = "";
  public errors_back= signal<string[]>([])
  //reemplaza por: public errors_back: string[] = [] signal es un generico lo cual lo hace muy util


  togglePassword(data: number): void {
    if(data == 1){
      this.showPassword = !this.showPassword
    }
    if(data == 2){
      this.showRepeatPassword = !this.showRepeatPassword
    }    
  }

  correoVerificacion(){
    const payload: CorreoCodigoVerificacionRequest={
      email: this.email,
      name: this.nombre,
      identificacion: this.identificacion,
      password: this.password,
      repeatPassword: this.repeatPassword,
      role: this.selectedRole! 
    }
    this.authService.correoCodigoVerificacion(payload).subscribe(
      {next: (response) => {
          this.authService.setFlagVerifyCode(true)
          this.router.navigate(['administrator/verifyCode'])
        },error: (error) =>{
          this.errors_back.set(error.error.errors)
          //reemplaza por: this.errors_back = error.error.errors
          console.log(this.errors_back())
        }
      })
    }
}

/* 
subscribe({
  next: () => {},
  error: () => {},
  complete: () => {}
})

forma actualizada del subscribe recomendada en breves rasgos
*/