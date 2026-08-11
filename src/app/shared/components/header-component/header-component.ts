import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth-service';
import { UserService } from '../../services/user.service';
import { User } from '../../../user';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-component',
  imports: [RouterLink],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent implements OnInit{
  private authService = inject(AuthService)
  private userService = inject(UserService)

  public isAdmin = computed(()=> this.authService.getRole() === 'ADMINISTRATOR')
  /* 
    signal() → almacena un valor que tú modificas.
    computed() → calcula un valor a partir de otros signals.
    | Situación                                                       | Usa                 |
    | --------------------------------------------------------------- | ------------------- |
    | El usuario hace clic en un enlace o botón para ir a otra página | `routerLink`        |
    | Tu código decide cuándo navegar                                 | `router.navigate()` |
  */
  public userInfo:User[]=[{
    id: this.authService.getUserId(),
    name: '',
    email: '',
    identificacion: ''
  }]
  public isMenuOpen= signal(false)
  public isProfileOpen= signal(false)
  ngOnInit(): void {
    this.getUserInfo()
  }
  toggleMenu(){
    this.isMenuOpen.update(value => !value)
    if(!this.isMenuOpen()){
      this.isProfileOpen.set(false)
    }
  }

  refreshtoDashboard(){
    const role=this.authService.getRole()
    this.authService.redirect(role!)
  }

  toggleProfile(){
    this.isProfileOpen.update(value => !value)
  }
  getUserInfo(){
    this.userService.getAll().subscribe({next: (response) =>{
        this.userInfo=response.data.filter(user => user.id == this.userInfo[0].id)
      },error: (error) =>{
        
      }
    })
  }
  logout(){
    this.authService.logout()
  }
}
