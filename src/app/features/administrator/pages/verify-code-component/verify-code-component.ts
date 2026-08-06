import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../auth/services/auth-service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header-component/header-component';

@Component({
  selector: 'app-verify-code-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent
  ],
  templateUrl: './verify-code-component.html',
  styleUrl: './verify-code-component.css',
})
export class VerifyCodeComponent{
  private authService = inject(AuthService)
  private router = inject(Router)
  public codigo: number = 0
  public errorCode= signal("")
  public verificatedPhase= signal(false)

  verificarCodigo(){
    this.authService.verifyCode(this.codigo).subscribe({
      next: (response) =>{
        console.log(this.codigo)
        this.verificatedPhase.set(true)
        setTimeout(()=>{
          this.router.navigate(['auth/login'])
        }, 4000)// 4 segundos
      },error: (error) =>{
        console.log(this.codigo)
        this.errorCode.set(error.error.errors[0])
        this.verificatedPhase.set(false)
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
