import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
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
export class VerifyCodeComponent{
  private authService = inject(AuthService)
  private cdr = inject(ChangeDetectorRef)
  private router = inject(Router)
  public codigo: number = 0
  public errorCode=""
  public verificatedPhase= signal(false)

  verificarCodigo(){
    this.errorCode = ""
    console.log(this.codigo)
    this.authService.verifyCode(this.codigo).subscribe({
      next: (response) =>{
        console.log(this.codigo)
        this.verificatedPhase.set(true)
        setTimeout(()=>{
          this.router.navigate(['auth/login'])
        }, 4000)// 4 segundos
      },error: (error) =>{
        console.log(this.codigo)
        this.errorCode=error.error.errors[0]
        this.verificatedPhase.set(false)
      }
    })
    /* this.authService.verifyCode(String(this.codigo)).subscribe(
      {
        next: (response) =>{
          //se escribe un mensaje de felicitacion y se regresa al login
        },
        error: (error) =>{
          //se escribe que el mensaje no es correcto y se mantiene en la misma pagina
        }
      }) */
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
