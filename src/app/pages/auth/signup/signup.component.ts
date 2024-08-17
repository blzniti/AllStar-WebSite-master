import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowDown,
  faCloudArrowDown,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import Toastify from 'toastify-js'
import { AuthService } from '../../../services/auth.service';
import { ImageService } from '../../../services/api/image.service';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MatButtonModule, CommonModule, FontAwesomeModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  constructor(private authService: AuthService, private imageService: ImageService) { }

  faArrowDown = faArrowDown;
  faCloudArrowDown = faCloudArrowDown;
  eye1: typeof faEye | typeof faEyeSlash = faEye;
  eye2: typeof faEye | typeof faEyeSlash = faEye;
  image: string | ArrayBuffer | null = null;
  imageFile: File | null = null
  isSigning: boolean = false;

  async signUp($event: SubmitEvent) {
    $event.preventDefault();
    if (this.isSigning) return;
    // disable form
    this.isSigning = true;

    const mainToast = Toastify({
      text: "Signing up...",
      backgroundColor: "linear-gradient(to right, #00d09b, #96c93d)",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
    })

    mainToast.showToast();

    // get form
    const form = $event.target as HTMLFormElement;

    // get form data
    let user = {
      username: form['username'].value,
      password: form['password'].value,
      displayName: form['displayName'].value,
      confirmPassword: form['confirmPassword'].value,
    }

    // check password match
    if (user.password != user.confirmPassword) {
      // alert('Password does not match');
      // toast
      Toastify({
        text: "Password does not match",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
        className: "info",
        gravity: 'bottom',
        position: 'right',
      }).showToast();

      mainToast.hideToast();
      this.isSigning = false;
      return;
    }

    // check image
    if (!this.imageFile) {
      // alert('Please upload an image');
      // toast
      Toastify({
        text: "Please upload an image",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
        className: "info",
        gravity: 'bottom',
        position: 'right',
      }).showToast();

      mainToast.hideToast();
      this.isSigning = false;
      return;
    }

    // sign up form-data
    const formData = new FormData();
    formData.append('file', this.imageFile);
    formData.append('username', user.username);
    formData.append('password', user.password);
    formData.append('displayName', user.displayName);
    // sign up
    await this.authService.signUpUser(formData)
    mainToast.hideToast();
    this.isSigning = false;
  }

  togglePasswordVisibility(input: HTMLInputElement, eye: number) {
    input.type = input.type === 'password' ? 'text' : 'password';
    if (eye === 1) {
      this.eye1 = input.type === 'password' ? faEye : faEyeSlash;
    } else {
      this.eye2 = input.type === 'password' ? faEye : faEyeSlash;
    }
  }

  handleFileInput($event: Event) {
    // file uploaded image to be displayed
    const file = ($event.target as HTMLInputElement).files![0];

    // Check file size
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      // alert('File size exceeds the maximum limit of 2MB');
      // toast alert
      Toastify({
        text: "File size exceeds the maximum limit of 2MB",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
        className: "info",
        gravity: 'bottom',
        position: 'right',
      }).showToast();
      // clear input
      ($event.target as HTMLInputElement).value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.image = reader.result;
    };
    reader.readAsDataURL(file);
    this.imageFile = file;
  }
}
