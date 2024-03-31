import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { environment as env }  from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  apiUrl = 'http://localhost:8080/'

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(this.getDecodedAccessToken(localStorage.getItem('token')!));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }


login(usernameOrEmail: string, password: string) {
  return this.http.post<any>(`${this.apiUrl}api/auth/login`, { usernameOrEmail, password })
    .pipe(map(response => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('isLoggedIn', 'true');
      this.currentUserSubject.next(this.getDecodedAccessToken(response.accessToken));
      console.log(this.currentUserSubject.value);
      return response;
    }));
}

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getDecodedAccessToken(token: string): any {
    try{
      return jwtDecode(token);
    }
    catch(Error){
      return null;
    }
  }
}
