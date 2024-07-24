import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service'
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private cookieService: CookieService, private authService: AuthService,
    private router: Router
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const user = this.authService.getUser();

      //check jwt token
      let token = this.cookieService.get('Authorization')

      if(token && user){
        token = token.replace('Bearer ', '');

        const decodedToken: any = jwtDecode(token);

        const expirationDate = decodedToken.exp * 1000;
        const currentTime = new Date().getTime();
        //Chek expiration token
        if(expirationDate < currentTime) {
          this.authService.logout();
          return this.router.createUrlTree(['/login'], { queryParams : { returnUrl: state.url } })
        }
        else{
          //This token still valid
          if(user.roles.includes('Writer')){
            return true;
          } else {
            alert('Unauthorized');
            return false;
          }
        }
      }
      else {
        this.authService.logout();
        return this.router.createUrlTree(['/login'], { queryParams : { returnUrl: state.url } })
      }

  }
  
}
