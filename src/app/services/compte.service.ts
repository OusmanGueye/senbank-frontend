import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CompteService {

  constructor(private http: HttpClient) { }

  apiURL = 'http://localhost:8080/';

  getAllComptes(pageOptions: string) {
    return this.http.get<any[]>(
      `${this.apiURL}api/comptes?${pageOptions}`, {
        observe: "response"
      }
    );
  }

  getCompte(id: number) {
    return this.http.get<any>(
      `${this.apiURL}api/comptes/${id}`
    );
  }


  createCompte(value: any) {
    return  this.http.post<any>(`${this.apiURL}api/comptes`, value, {
      observe: "response"
    })
  }


  creditCompte(value: any) {
    return  this.http.post<any>(`${this.apiURL}api/comptes/credit`, value, {
      observe: "response"
    });
  }

  getCompteByUserId(userId: any) {
    return this.http.get<any[]>(
      `${this.apiURL}api/comptes/user/${userId}`, {
        observe: "response"
      }
    );
  }

  virementCompte(value: any) {
    return  this.http.post<any>(`${this.apiURL}api/comptes/virement`, value, {
      observe: "response"
    });
  }


}
