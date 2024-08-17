import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';
import Toastify from 'toastify-js'

import {
  faArrowDown,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../services/auth.service';
import { SignInReq } from '../../../models/auth/sign-in-req';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FontAwesomeModule, RouterLink, MatButtonModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
  constructor(private authService: AuthService) { }


  router: Router = inject(Router)
  faArrowDown = faArrowDown;
  eye1: typeof faEye | typeof faEyeSlash = faEye;
  isSigning: boolean = false;

  togglePasswordVisibility(input: HTMLInputElement) {
    input.type = input.type === 'password' ? 'text' : 'password';
    this.eye1 = input.type === 'password' ? faEye : faEyeSlash;
  }

  async signIn($event: Event) {
    if (this.isSigning) return;
    $event.preventDefault();
    // get form
    const form = $event.target as HTMLFormElement;
    // disable form
    this.isSigning = true
    const user: SignInReq = {
      username: form['username'].value,
      password: form['password'].value
    }

    // toast alert
    let toast = Toastify({
      text: "Logging in...",
      backgroundColor: "linear-gradient(to right, #00d09b, #96c93d)",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
    })
    toast.showToast();

    // call api
    await this.authService.sinInUser(user)
    this.isSigning = false
  }
}
