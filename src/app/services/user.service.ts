import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  apiURL = 'http://localhost:8080/';

  getAllUsers(pageOptions: string) {
    return this.http.get<any[]>(
      `${this.apiURL}api/users?${pageOptions}`, {
        observe: "response"
      }
    );
  }


  updateUser(value: any) {
    return this.http.put<any>(
      `${this.apiURL}api/users/update`, value
    );
  }


  createUser(value: any) {
    return  this.http.post<any>(`${this.apiURL}api/auth/register`, value, {
      observe: "response"
    })
  }

  getStats() {
    return  this.http.get<any>(`${this.apiURL}api/users/statistiques`, {
      observe: "response"
    });
  }

}
