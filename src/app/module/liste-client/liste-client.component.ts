import {Component, inject, OnInit, TemplateRef} from '@angular/core';
import {MatButton, MatFabButton, MatIconButton} from "@angular/material/button";
import {User} from "../../modele/user";
import {UserService} from "../../services/user.service";
import {MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {ShareModule} from "../../share/share.module";
import {MyCustomPaginatorIntl} from "../../share/util/my-custom-paginator-intl.service";
import {PaginationService} from "../../share/util/pagination.service";
import {MatIcon} from "@angular/material/icon";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../config/auth.service";
import {CommonModule, NgClass} from "@angular/common";
import Swal from "sweetalert2";

@Component({
  selector: 'app-liste-client',
  standalone: true,
  imports: [
    MatButton,
    MatPaginator,
    ShareModule,
    MatPaginatorModule,
    MatIcon,
    MatIconButton,
    MatFabButton,
    ReactiveFormsModule,
    NgClass,
    CommonModule
  ],
  providers: [{provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}],
  templateUrl: './liste-client.component.html',
  styleUrl: './liste-client.component.css'
})
export class ListeClientComponent implements OnInit{

  totalPages: number = 0;
  pageEvent: PageEvent | undefined;
  size: number = 0;
  page: number = 0;
  previousSize: number = 0;

  users:User[] | null = [];

  private modalService = inject(NgbModal);
  closeResult = '';

  userForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    username: new FormControl('', Validators.required),
    password: new FormControl('',  Validators.required),
    email: new FormControl('',  Validators.required),
    name: new FormControl('',  Validators.required),
  });

  title : string = "";

  constructor(private userService:UserService,  private paginationService: PaginationService, private authService:AuthService) { }

  ngOnInit(): void {
    this.getAllUsers(0, 10);
  }

  getAllUsers(page: number, size: number) {
    this.page = page;
    this.size = size;
    this.userService.getAllUsers(this.paginationService.changePaginationOptionsForGoToPage(page, size)).subscribe({
      next: (data) => {
        this.users = data.body;
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
      this.getAllUsers(event.pageIndex, event.pageSize)
    } else {
      this.getAllUsers(0, event.pageSize)
    }
  }

  open(content: TemplateRef<any>, user?: User) {
    this.title = user == null ? "Ajouter un client" : "Modifier un client";
    if (user != null) {
      this.userForm.setValue({
        id: user.id,
        username: user.username,
        password: user.password,
        email: user.email,
        name: user.name,
      });
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop:false }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
        if (result === 'Save click') {
          this.createUsers();
        }
        if (result === 'Edit click') {
          this.updateUsers(user);
        }
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  private createUsers() {
    this.userService.createUser(this.userForm.value).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Le client a été ajouté avec succès!',
        }).then((result) => {
          if (result.isConfirmed) {
            this.getAllUsers(0, 10);
            this.userForm.reset();
            this.modalService.dismissAll();
          }
        });
      },
      error: (error) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Une erreur s\'est produite lors de l\'ajout du client!',
        }).then((result) => {
          if (result.isConfirmed) {
            this.getAllUsers(0, 10);
            this.userForm.reset();
            this.modalService.dismissAll();
          }
        });
      }
    });
  }


  private updateUsers(user: User | undefined) {
    this.userService.updateUser(this.userForm.value).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Le client a été modifié avec succès!',
        }).then((result) => {
          if (result.isConfirmed) {
            this.getAllUsers(0, 10);
            this.userForm.reset();
            this.modalService.dismissAll();
          }
        });
      },
      error: (error) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Une erreur s\'est produite lors de la modification du client!',
        }).then((result) => {
          if (result.isConfirmed) {
            this.getAllUsers(0, 10);
            this.userForm.reset();
            this.modalService.dismissAll();
          }
        });
      }
    });
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

}
