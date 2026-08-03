import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth-service';

export const verifyCodeGuard: CanActivateFn = (route, state) => {
  console.log('verifyCodeGuard activate');
  const authService = inject(AuthService)
  const router = inject(Router)

  if(authService.getFlagVerifyCode()){
    return true
  }
  return  router.createUrlTree(['/administrator'])
};
