import {Component, OnInit} from '@angular/core';
import {DatePipe, NgIf, UpperCasePipe} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {User} from "../../modele/user";
import {Transaction} from "../../modele/transaction";
import {TransactionService} from "../../services/transaction.service";
import {PaginationService} from "../../share/util/pagination.service";

@Component({
  selector: 'app-liste-transaction',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    MatFabButton,
    MatIcon,
    MatPaginator,
    NgIf,
    ReactiveFormsModule,
    UpperCasePipe
  ],
  templateUrl: './liste-transaction.component.html',
  styleUrl: './liste-transaction.component.css'
})
export class ListeTransactionComponent implements OnInit{

  totalPages: number = 0;
  pageEvent: PageEvent | undefined;
  size: number = 0;
  page: number = 0;
  previousSize: number = 0;

  transactions:Transaction[] | null = [];

  constructor(private transactionServiice:TransactionService, private paginationService: PaginationService) { }

  ngOnInit(): void {
    this.getAllTransaction(0, 10);
  }

  getAllTransaction(page: number, size: number) {
    this.page = page;
    this.size = size;
    this.transactionServiice.getAllTransactions(this.paginationService.changePaginationOptionsForGoToPage(page, size)).subscribe({
      next: (data) => {
        this.transactions = data.body;
        this.totalPages =  Number(data.headers.get("X-Total-Count"));
      },
      error: (error) => {
        console.error(error);
      }
    });
  }


  handlePaginationItemPerItemps(event: PageEvent) {
    this.pageEvent = event;
    this.previousSize = this.size;
    this.size = event.pageSize;
    this.page = event.pageIndex;
    if (event.pageSize == this.previousSize) {
      this.getAllTransaction(event.pageIndex, event.pageSize)
    } else {
      this.getAllTransaction(0, event.pageSize)
    }
  }


}
