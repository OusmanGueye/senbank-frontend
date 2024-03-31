import {Component, inject, OnInit, TemplateRef} from '@angular/core';
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton, MatFabButton} from "@angular/material/button";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {User} from "../../modele/user";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {TypeCompte} from "../../modele/type-compte";
import {Compte} from "../../modele/compte";
import {UserService} from "../../services/user.service";
import {PaginationService} from "../../share/util/pagination.service";
import {AuthService} from "../../config/auth.service";
import {TypeCompteService} from "../../services/type-compte.service";
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf, UpperCasePipe} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {CompteService} from "../../services/compte.service";
import Swal from "sweetalert2";
import {NgSelectComponent, NgSelectModule} from "@ng-select/ng-select";
import {MatOption, MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-liste-compte',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatButton,
    DatePipe,
    FormsModule,
    MatFabButton,
    MatIcon,
    MatPaginator,
    NgIf,
    ReactiveFormsModule,
    CurrencyPipe,
    NgClass,
    NgSelectModule,
    UpperCasePipe,
    MatSelect,
    MatOption,
    NgForOf,
  ],
  templateUrl: './liste-compte.component.html',
  styleUrl: './liste-compte.component.css'
})
export class ListeCompteComponent implements OnInit{

  totalPages: number = 0;
  pageEvent: PageEvent | undefined;
  size: number = 0;
  page: number = 0;
  previousSize: number = 0;

  users:User[] | null = [];
  typeComptes:TypeCompte[] | null = [];
  comptes:Compte[] | null = [];

  private modalService = inject(NgbModal);
  closeResult = '';

  titlte: string = "";

  compteForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    typeDeCompteId: new FormControl('', Validators.required),
    userId: new FormControl('',  Validators.required),
    solde: new FormControl(0,  Validators.required),
  });

  constructor(private userService:UserService,  private paginationService: PaginationService, private typeCompteService:TypeCompteService, private compteService:CompteService) { }

  ngOnInit(): void {
    this.getAllUsers();
    this.getAllTypeCompte();
    this.getAllComptes(0, 10);
  }

  getAllUsers() {
    this.userService.getAllUsers(this.paginationService.changePaginationOptionsForGoToPage(0, 20)).subscribe({
      next: (data) => {
        this.users = data.body;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getAllTypeCompte(){
    this.typeCompteService.getAllTypeComptes(this.paginationService.changePaginationOptionsForGoToPage(0, 20)).subscribe({
      next: (data) => {
        this.typeComptes = data.body;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getAllComptes(page: number, size: number){
    this.page = page;
    this.size = size;
    this.compteService.getAllComptes(this.paginationService.changePaginationOptionsForGoToPage(page, size)).subscribe({
      next: (data) => {
        this.comptes = data.body;
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
      this.getAllComptes(event.pageIndex, event.pageSize)
    } else {
      this.getAllComptes(0, event.pageSize)
    }
  }

  open(content: TemplateRef<any>, compte?: Compte) {
    this.titlte = compte == null ? "Ajouter un Compte" : "Crediter un Compte";
    if (compte != null) {

    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop:false }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        if (result === 'Save click') {
          this.createCompte();
        }
        if (result === 'Edit click') {
          this.creditCompte();
        }
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  private createCompte() {
    if (this.compteForm.valid) {
      this.compteService.createCompte(this.compteForm.value).subscribe({
        next: (data) => {
          Swal.fire({
            title: 'Succès',
            text: 'Compte ajouté avec succès',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
              this.compteForm.reset();
              this.modalService.dismissAll();
              this.getAllComptes(0, 10);
            }
          });
        },
        error: (error) => {
          console.error(error);
          Swal.fire({
            title: 'Erreur',
            text: 'Une erreur est survenue lors de l\'ajout du compte',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      });
    }
  }


  private creditCompte() {
    this.compteService.creditCompte(this.compteForm.value).subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Succès',
          text: 'Compte crédité avec succès',
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            this.compteForm.reset();
            this.modalService.dismissAll();
            this.getAllComptes(0, 10);
          }
        });
      },
      error: (error) => {
        console.error(error);
        Swal.fire({
          title: 'Erreur',
          text: 'Une erreur est survenue lors du crédit du compte',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }


}
