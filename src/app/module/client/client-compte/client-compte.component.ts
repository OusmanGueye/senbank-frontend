import {Component, inject, OnInit} from '@angular/core';
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf, UpperCasePipe} from "@angular/common";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatAnchor, MatButton, MatFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatPaginator} from "@angular/material/paginator";
import {NgSelectModule} from "@ng-select/ng-select";
import {User} from "../../../modele/user";
import {TypeCompte} from "../../../modele/type-compte";
import {Compte} from "../../../modele/compte";
import {MatTooltip} from "@angular/material/tooltip";
import {UserService} from "../../../services/user.service";
import {PaginationService} from "../../../share/util/pagination.service";
import {TypeCompteService} from "../../../services/type-compte.service";
import {CompteService} from "../../../services/compte.service";
import Swal from "sweetalert2";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-client-compte',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    FormsModule,
    MatFabButton,
    MatIcon,
    MatPaginator,
    NgIf,
    NgSelectModule,
    ReactiveFormsModule,
    UpperCasePipe,
    MatAnchor,
    MatTooltip,
    MatButton,
    NgForOf,
    NgClass
  ],
  templateUrl: './client-compte.component.html',
  styleUrl: './client-compte.component.css'
})
export class ClientCompteComponent implements OnInit{

  users:User[] | null = [];
  comptes:Compte[] | null = [];
  username: string = "";

  selectedTabIndex: number = 0;

  private modalService = inject(NgbModal);
  closeResult = '';

  titlte: string = "";

  compteForm: FormGroup = new FormGroup({
    solde: new FormControl('', Validators.required),
    numeroCompte: new FormControl('', Validators.required),
    idCompte: new FormControl(''),
    montant: new FormControl('', Validators.required),
  });


  constructor(private userService:UserService,  private paginationService: PaginationService, private typeCompteService:TypeCompteService, private compteService:CompteService) { }

  ngOnInit(): void {
    this.username = localStorage.getItem('username')!;
    this.getCompteByUsername(this.username);
    this.getAllUsers();
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

  getCompteByUsername(username: any) {
    this.compteService.getCompteByUserId(username).subscribe({
      next: (data) => {
        this.comptes = data.body;
        console.log(data.body);
      },
      error: (error) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Une erreur est survenue lors de la récupération des comptes'
        });
      }
    });
  }

  openDialog(content: any, compte: Compte, isVirement?: boolean, isDepot?: boolean, isRetrait?: boolean) {
    if (isVirement) {
      this.titlte = "Virement";
      this.compteForm.patchValue({
        solde: compte.solde,
        idCompte: compte.id,
      });
    }
    if (isDepot) {
      this.titlte = "Dépot";
      this.compteForm.patchValue({
        solde: compte.solde,
        idCompte: compte.id,
        numeroCompte: compte.numero
      });
    }
    if (isRetrait) {
      this.titlte = "Retrait";
      this.compteForm.patchValue({
        solde: compte.solde,
        idCompte: compte.id,
        numeroCompte: compte.numero
      });
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop:false }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        if (result === 'Save virement') {
          this.virementCompte();
        }
        if (result === 'Edit click') {

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


  private virementCompte() {
    if (this.compteForm.valid) {
      this.compteService.virementCompte(this.compteForm.value).subscribe({
        next: (data) => {
          Swal.fire({
            title: 'Succès',
            text: 'Virement effectué avec succès',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
              this.compteForm.reset();
              this.modalService.dismissAll();
              this.getCompteByUsername(this.username);
            }
          });
        },
        error: (error) => {
          console.error(error);
          Swal.fire({
            title: 'Erreur',
            text: 'Une erreur est survenue lors du virement',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      });
    }
  }


}
