import {Component, inject, OnInit, TemplateRef} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {User} from "../../modele/user";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {TypeCompte} from "../../modele/type-compte";
import {PaginationService} from "../../share/util/pagination.service";
import {TypeCompteService} from "../../services/type-compte.service";
import Swal from "sweetalert2";
import {DatePipe, NgClass, NgIf, UpperCasePipe} from "@angular/common";
import {MatFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-type-compte',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    MatFabButton,
    MatIcon,
    MatPaginator,
    NgIf,
    ReactiveFormsModule,
    UpperCasePipe,
    NgClass
  ],
  templateUrl: './type-compte.component.html',
  styleUrl: './type-compte.component.css'
})
export class TypeCompteComponent implements OnInit{

  totalPages: number = 0;
  pageEvent: PageEvent | undefined;
  size: number = 0;
  page: number = 0;
  previousSize: number = 0;

  typeComptes:TypeCompte[] | null = [];

  private modalService = inject(NgbModal);
  closeResult = '';

  typeCompteForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    nom: new FormControl('', Validators.required),
    tauxInteret: new FormControl(0,  Validators.required),
    fraisTransaction: new FormControl(0,  Validators.required),
    fraisOuverture: new FormControl(0,  Validators.required),
    prefixe: new FormControl('',  Validators.required),
  });

  title : string = "";


  constructor(
    private paginationService: PaginationService, private typeCompteService:TypeCompteService
  ) { }

  ngOnInit(): void {
    this.getAllTypeCompte(0, 10);
  }

  getAllTypeCompte(page: number, size: number){
    this.page = page;
    this.size = size;
    this.typeCompteService.getAllTypeComptes(this.paginationService.changePaginationOptionsForGoToPage(page, size)).subscribe({
      next: (data) => {
        this.typeComptes = data.body;
        this.totalPages = Number(data.headers.get("X-Total-Pages"));
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  handlePaginationItemPerItemps(event: PageEvent) {
    this.pageEvent = event;
    this.previousSize = this.size;
    this.size = event.pageSize;
    this.page = event.pageIndex;
    if (event.pageSize == this.previousSize) {
      this.getAllTypeCompte(event.pageIndex, event.pageSize)
    } else {
      this.getAllTypeCompte(0, event.pageSize)
    }
  }

  open(content: TemplateRef<any>, typeCompte?: TypeCompte) {
    this.title = typeCompte == null ? "Ajouter Type Compte" : "Modifier Type Compte";
    if (typeCompte != null) {
      this.typeCompteForm.setValue({
        id: typeCompte.id,
        nom: typeCompte.nom,
        tauxInteret: typeCompte.tauxInteret,
        fraisTransaction: typeCompte.fraisTransaction,
        fraisOuverture: typeCompte.fraisOuverture,
        prefixe: typeCompte.prefixe,
      });
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop:false }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        if (result === 'Save click') {
          this.createTypeCompte();
        }
        if (result === 'Edit click') {
          this.updateTypeCompte();
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


  private createTypeCompte() {
    this.typeCompteService.createTypeCompte(this.typeCompteForm.value).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Type de compte ajouté avec succès!',
        }).then((result) => {
          if (result.isConfirmed) {
            this.getAllTypeCompte(0, 10);
            this.typeCompteForm.reset();
            this.modalService.dismissAll();
          }
        });
      },
      error: (error) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Une erreur s\'est produite lors de l\'ajout du type de compte!',
        }).then((result) => {
          if (result.isConfirmed) {
            this.getAllTypeCompte(0, 10);
            this.typeCompteForm.reset();
            this.modalService.dismissAll();
          }
        });
      }
    });
  }

  private updateTypeCompte() {
    this.typeCompteService.updateTypeCompte(this.typeCompteForm.value).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Type de compte modifié avec succès!',
        }).then((result) => {
          if (result.isConfirmed) {
            this.getAllTypeCompte(0, 10);
            this.typeCompteForm.reset();
            this.modalService.dismissAll();
          }
        });
      },
      error: (error) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Une erreur s\'est produite lors de la modification du type de compte!',
        }).then((result) => {
          if (result.isConfirmed) {
            this.getAllTypeCompte(0, 10);
            this.typeCompteForm.reset();
            this.modalService.dismissAll();
          }
        });
      }
    });
  }





}
