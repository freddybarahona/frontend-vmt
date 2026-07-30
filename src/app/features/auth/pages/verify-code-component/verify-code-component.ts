import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-code-component',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './verify-code-component.html',
  styleUrl: './verify-code-component.css',
})
export class VerifyCodeComponent {
  private authService = inject(AuthService)
  public codigo: string = ""
  private router = inject(Router)
  public error=""

  verificarCodigo(){
    console.log(this.codigo)
    this.authService.verifyCode(String(this.codigo)).subscribe(
      {
        next: (response) =>{
          //se escribe un mensaje de felicitacion y se regresa al login
        },
        error: (error) =>{
          //se escribe que el mensaje no es correcto y se mantiene en la misma pagina
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
