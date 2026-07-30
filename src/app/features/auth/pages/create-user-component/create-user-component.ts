import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { CorreoCodigoVerificacionRequest } from '../../../../shared/interfaces/correo-codigo-verificacion-request';
import { Router } from '@angular/router';
import { response } from 'express';

@Component({
  selector: 'app-create-user-component',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './create-user-component.html',
  styleUrl: './create-user-component.css',
})
export class CreateUserComponent {
  private router = inject(Router)
  private authService= inject(AuthService)
  public showPassword = false
  public nombre = ''
  public email = ''
  public password= ''
  public repeatPassword= ''
  public showRepeatPassword = false
  public identificacion = ''
  public selectedRole: 'STUDENT' | 'PROFFESOR' | null = null;
  public actualError: string[]= []
  public errors=['Este email ya existe','Este correo es invalido','Este campo solo admite letras', 'las contrasenas no coinciden', 'el campo contrasena es necesario', 'no selecciono tipo', 'este campo solo acepta 10 numeros', 'el campo nombre es necesario', 'este campo solo acepta nombres en texto']
  
  togglePassword(data: number): void {
    if(data == 1){
      this.showPassword = !this.showPassword
    }
    if(data == 2){
      this.showRepeatPassword = !this.showRepeatPassword
    }    
  }

  ingresoNombre(){
    let index = this.errors.indexOf('el campo nombre es necesario')
    let pos = 0
    if(this.nombre.length == 0){
      return this.actualError.find(error => error == this.errors[index])? null : this.actualError.push(this.errors[index]) 
    }
    if(/^(?=.*[A-Za-z])[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(this.nombre) == false){
      index = this.errors.indexOf('este campo solo acepta nombres en texto')
      return this.actualError.find(error => error == this.errors[index])? null : this.actualError.push(this.errors[index]) 
    }
    if(this.nombre.length > 0 ){
      index =this.errors.indexOf('el campo nombre es necesario')
      pos= this.actualError.indexOf(this.errors[index])
      this.actualError.splice(pos)
      if(/^(?=.*[A-Za-z])[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(this.nombre) == true){
        index = this.errors.indexOf('este campo solo acepta nombres en texto')
        pos= this.actualError.indexOf(this.errors[index])
        this.actualError.splice(pos)
        return
      } 
    }
    return


  }

  ingresoCorreo(){
    let index =this.errors.indexOf('Este correo es invalido')
    let pos = 0
    if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email) == false){
      //pos = this.actualError.indexOf(this.errors[index])
      return this.actualError.find(error => error == this.errors[index])? null : this.actualError.push(this.errors[index]) 
    }
    if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email) == true){
      pos = this.actualError.indexOf(this.errors[index])
      return this.actualError.splice(pos)
    }
    return
  }
  
  equalPasswords(){
    let index = 0
    let pos= 0
    if(this.password != this.repeatPassword){
      index = this.errors.indexOf('las contrasenas no coinciden')
      return this.actualError.find(error => error == this.errors[index])? null : this.actualError.push(this.errors[index])
    }
    if(this.password.length == 0 && this.repeatPassword.length == 0){
      index = this.errors.indexOf('el campo contrasena es necesario')
      return this.actualError.find(error => error ==this.errors[index])? null : this.actualError.push(this.errors[index])
    }
    if(this.password == this.repeatPassword && this.password.length > 0 && this.repeatPassword.length > 0){
      index = this.errors.indexOf('las contrasenas no coinciden')
      pos=this.actualError.indexOf(this.errors[index])
      this.actualError.splice(pos)
      index = this.errors.indexOf('el campo contrasena es necesario')
      pos=this.actualError.indexOf(this.errors[index])
      this.actualError.splice(pos)
      return 
    }
    return
  }
  eligioTipo(){
    let index = 0
    let pos = 0
    if(this.selectedRole == null){
      index = this.errors.indexOf('no selecciono tipo')
      this.actualError.find(error => error ==this.errors[index])? null : this.actualError.push(this.errors[index])
      console.log(this.actualError)
      return
    }if(this.selectedRole == 'STUDENT' || this.selectedRole == 'PROFFESOR'){
      index = this.errors.indexOf('no selecciono tipo')
      pos=this.actualError.indexOf(this.errors[index])
      console.log(this.actualError)
      return this.actualError.splice(pos)
    }
    return
  }

  pusoIdentificacion(){
    let index = 0
    let pos = 0
    index = this.errors.indexOf('este campo solo acepta 10 numeros')
    if(this.identificacion.length != 10 || /^\d+$/.test(this.identificacion) == false){
      return this.actualError.find(error => error ==this.errors[index])? null : this.actualError.push('este campo solo acepta 10 numeros')
    }else{
      pos=this.actualError.indexOf(this.errors[index])
      return this.actualError.splice(pos)
    }
  }

  verificarCampos(){
    this.ingresoNombre()
    this.pusoIdentificacion()
    this.equalPasswords()
    this.ingresoCorreo()
    this.eligioTipo()
    this.correoVerificacion()
    return
  }


  correoVerificacion(){
    const payload: CorreoCodigoVerificacionRequest={
      email: this.email,
      name: this.nombre,
      identificacion: this.identificacion,
      password: this.password,
      role: this.selectedRole!
    }
    this.authService.correoCodigoVerificacion(payload).subscribe(
      {next: (response) => {
          console.log('pasamos a mandar el mensaje de verificacion de correo y a su pagina respectiva')
          console.log(payload)
          console.log(response.message)
          this.router.navigate(['auth/verifyCode'])
        },error: (error) =>{
          let index =this.errors.indexOf('Este email ya existe')
          let pos = 0
          if(error.message == this.errors[index]){
            this.actualError.find(error => error ==this.errors[index])? null : this.actualError.push(this.errors[index])
          }
          console.log(payload)
          console.log(error.mensaje)  
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