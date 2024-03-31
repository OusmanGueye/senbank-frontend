import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatError, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {User} from "../../../modele/user";
import {TypeCompte} from "../../../modele/type-compte";
import {Compte} from "../../../modele/compte";
import {UserService} from "../../../services/user.service";
import {TypeCompteService} from "../../../services/type-compte.service";
import {CompteService} from "../../../services/compte.service";
import {PaginationService} from "../../../share/util/pagination.service";
import {MatInput} from "@angular/material/input";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-create-compte',
  standalone: true,
  imports: [
    MatDialogActions,
    MatButton,
    MatError,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    MatDialogContent,
    MatIcon,
    MatDialogTitle,
    MatIconButton,
    MatDialogClose,
    MatInput,
    NgIf,
    NgForOf
  ],
  templateUrl: './create-compte.component.html',
  styleUrl: './create-compte.component.css'
})
export class CreateCompteComponent {

  users:User[] | null = [];
  typeComptes:TypeCompte[] | null = [];
  comptes:Compte[] | null = [];
  titre: string;

  compteForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CreateCompteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private typeCompteService:TypeCompteService, private compteService:CompteService,
    private paginationService: PaginationService
  ) {
    this.compteForm = this.formBuilder.group({
      userId: ['', Validators.required],
      typeDeCompteId: ['', Validators.required],
      solde: ['', Validators.required]
    });
    this.titre = data.titre;
    if (data.compte != null) {
      // Remplir le formulaire avec les données du compte pour la modification
      this.compteForm.patchValue({
        userId: data.compte.userId,
        typeDeCompteId: data.compte.typeDeCompteId,
        solde: data.compte.solde
      });
    }
    // Charger les utilisateurs et les types de compte
    this.getAllUsers();
    this.getAllTypeCompte();
  }

  closeDialog(action?: string): void {
    this.dialogRef.close(action);
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

}
