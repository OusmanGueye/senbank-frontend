import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "./auth.service";


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = localStorage.getItem('token')!;
    const decodedToken = this.authService.getDecodedAccessToken(token);
    const role = decodedToken.roles;

    if (role === 'ROLE_ADMIN') {
      return true;
    } else {
      alert('Vous n\'avez pas les droits pour accéder à cette page');
      return false;
    }
  }

}
