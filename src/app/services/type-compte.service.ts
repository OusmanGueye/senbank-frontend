import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TypeCompteService {

  constructor(private http: HttpClient) { }

  apiURL = 'http://localhost:8080/';

  createTypeCompte(value: any) {
    return  this.http.post<any>(`${this.apiURL}api/type-comptes`, value, {
      observe: "response"
    })
  }

  getAllTypeComptes(pageOptions: string) {
    return this.http.get<any[]>(
      `${this.apiURL}api/type-comptes?${pageOptions}`, {
        observe: "response"
      }
    );
  }

  getTypeCompte(id: number) {
    return this.http.get<any>(
      `${this.apiURL}api/type-comptes/${id}`
    );
  }

  updateTypeCompte(value: any) {
    return this.http.put<any>(
      `${this.apiURL}api/type-comptes`, value
    );
  }


}
