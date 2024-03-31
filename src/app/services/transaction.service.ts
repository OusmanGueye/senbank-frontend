import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) { }

  apiURL = 'http://localhost:8080/';


  getAllTransactions(pageOptions: string) {
    return this.http.get<any[]>(
      `${this.apiURL}api/transactions?${pageOptions}`, {
        observe: "response"
      }
    );
  }

}
