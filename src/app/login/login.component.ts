import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../config/auth.service";
import {Router} from "@angular/router";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  loginForm?: FormGroup;

  constructor(private authService: AuthService, private router:Router) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  login() {
    if (this.loginForm?.valid) {
      this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
        next: () => {
          // navigate to the home page
          let decodeToken = this.authService.getDecodedAccessToken(localStorage.getItem('token')!);
          if (decodeToken.roles === 'ROLE_ADMIN') {
            this.router.navigate(['/app/dashboard']);
          } else {
            localStorage.setItem('username', decodeToken.sub);
            this.router.navigate(['/app/client']);
          }
        },
        error: (error) => {
          // handle error
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Invalid username or password!',
          });
        }
      });
    }
  }


}
