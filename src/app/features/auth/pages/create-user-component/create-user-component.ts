import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  public showPassword = false
  public nombre = ''
  public email = ''
  public password= ''
  public repeatPassword= ''
  public showRepeatPassword = false
  public selectedRole: 'STUDENT' | 'PROFFESOR' | null = null;

  togglePassword(data: number): void {
    if(data == 1){
      this.showPassword = !this.showPassword
    }
    if(data == 2){
      this.showRepeatPassword = !this.showRepeatPassword
    }    
  }

  verificarCorreo(){
    console.log('pasamos a mandar el mensaje de verificacion de correo y a su pagina respectiva')
  }
}
