import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../features/auth/services/auth-service';
import { jwtDecode} from 'jwt-decode';
import { JwtPayload } from '../../features/auth/interfaces/jwt-payload.interface';

export const authGuard: CanActivateFn = (route, state) => { //o no va ni routeni state o van las dos recuerda

  const router = inject(Router);
  const platformId = inject(PLATFORM_ID); //registro de un identifiador de plataforma(browser) o server esto fue por un error que me salia en consola no bloqueaba nada solo es por estetica
  console.log(platformId)
  if (!isPlatformBrowser(platformId)) { //si es false osea estoy en el server entra (esto aplica en un reload)
    return true
  }

  const token = localStorage.getItem('token')// busca el token en el caso que exista 
  if (!token) { 
    return router.createUrlTree(['/login']); //si no hay token a login devuelta
  }
  const payload = jwtDecode<JwtPayload>(token)
  /* ojo este JwtPayload es la interfaz que hice yo con mis propiedades de backend
  porque el JwtPayload de JwtDecode no to tiene las propiedades personalizadas
  sino las propiedades fijas de Jwt me refiero al tiempo de creacion y al tiempo
  de expiracion  */
  const role = payload.role //obtiene el role que esta en el token

  console.log('token: ',token)
  console.log('role:',role)
  console.log('dashboard:', getDashboard(role))

  const currentPath = route.routeConfig?.path //obtiene la ruta actual
  console.log('ruta actual:',currentPath)
  const dashboard = getDashboard(role);

  if (currentPath !== dashboard.replace('/', '')) {
    return router.createUrlTree([dashboard]);
  }
  /* verifica que la currentPath que retorna proffesor, 
  sea igual al dashboard que viene con una / pero aca 
  la reemplaza por la ruta real generada en el app.routes  */

  return true
};

//version actualizada del function anterior
const getDashboard =(role: string | null): string => {
  switch (role){
    case 'PROFFESOR':
      return '/proffesor'

    case 'STUDENT':
      return '/student'

    case 'ADMINISTRATOR':
      return '/administrator'
    default:
      return '/login'
  }
}
//hacer que cuando el usuario ingrese, vea su dashboard y digamos su dashboard es proffesor luego el cambia manualmente al dashboard student entonces no lo regrese al login despues de dar enter sino que lo mande a su dashboard original