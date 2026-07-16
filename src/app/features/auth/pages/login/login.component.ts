import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html'
})

export class LoginComponent {

  public email = ''
  public password = ''

  constructor( private authService: AuthService, private router: Router
  ){}

  public showPassword = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: response => {
        console.log(response)
        const token = response.data.token;
        this.authService.saveToken(token);
        console.log(this.authService.getPayload());
        console.log(this.authService.getRole());
        const role = this.authService.getRole();

        switch(role){

          case 'ADMINISTRATOR':
            this.router.navigate(['/administrator']);
            break;

          case 'PROFFESOR':
            this.router.navigate(['/proffesor']);
            this.router.navigate(['/student']); //esto es solo para pruebas
            break;

          case 'STUDENT':
            this.router.navigate(['/student']);
            break;
        }
      },
      error: err => {
        console.error(err)
      }
    });

  }
}