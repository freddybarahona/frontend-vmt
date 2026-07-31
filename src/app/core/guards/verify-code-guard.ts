import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth-service';
import { inject } from '@angular/core';

export const verifyCodeGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if(authService.getFlagVerifyCode()){
    return true
  }

  router.navigate(['auth/create-user'])
  return false
};
