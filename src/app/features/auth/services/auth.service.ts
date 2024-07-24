import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-reques.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginResponse } from '../models/login-response.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { User } from '../models/user.model';
import { CookieService } from 'ngx-cookie-service'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  $user = new BehaviorSubject<User | undefined>(undefined);

  constructor(private httpClient: HttpClient, private cookieService: CookieService) { }

  login(request: LoginRequest): Observable<LoginResponse>
  {
    return this.httpClient.post<LoginResponse>(`${environment.apiBaseUrl}/api/auth/login`, request);
  }

  setUser(user: User){
    this.$user.next(user);
    localStorage.setItem('user-email', user.email);
    localStorage.setItem('user-roles', user.roles.join(','));
  }

  user(): Observable<User | undefined>{
    return this.$user.asObservable();
  }

  logout(){
    localStorage.clear();
    this.cookieService.delete('Authorization', '/');
    this.$user.next(undefined);
  }

  getUser(): User | undefined{
    const email = localStorage.getItem('user-email');
    const roles = localStorage.getItem('user-roles');

    if(email && roles){
      const user: User = {
        email: email,
        roles: roles.split(',')
      };
      return user;
    }

    return undefined;
  }

}
