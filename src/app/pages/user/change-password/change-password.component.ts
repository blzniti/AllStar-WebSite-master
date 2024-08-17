import Toastify from 'toastify-js'
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../../services/api/user.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [RouterModule, FontAwesomeModule, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  eye1: typeof faEye | typeof faEyeSlash = faEye;
  eye2: typeof faEye | typeof faEyeSlash = faEye;
  eye3: typeof faEye | typeof faEyeSlash = faEye;
  isChanging: boolean = false;

  userService = inject(UserService)

  togglePasswordVisibility(input: HTMLInputElement, eye: number) {
    input.type = input.type === 'password' ? 'text' : 'password';
    if (eye === 1) {
      this.eye1 = input.type === 'password' ? faEye : faEyeSlash;
    } else {
      this.eye2 = input.type === 'password' ? faEye : faEyeSlash;
    }
  }

  change($event: Event) {
    $event.preventDefault();
    if (this.isChanging) return;
    // disable form
    this.isChanging = true;
    // get form
    const form = $event.target as HTMLFormElement;
    // get form data
    let user = {
      oldPassword: form['oldPassword'].value,
      newPassword: form['newPassword'].value
    };


    // check if new password is same with old password
    if (user.oldPassword === user.newPassword) {
      // enable form
      this.isChanging = false;
      // toast
      Toastify(
        {
          text: 'New password cannot be the same as old password',
          backgroundColor: 'linear-gradient(to right, #ff416c, #ff4b2b)',
          duration: 3000,
          close: true,
          gravity: 'top',
          position: 'right',
          stopOnFocus: true
        }
      ).showToast();
      return;
    }

    // check if new password is same with confirm password
    if (user.newPassword !== form['confirmPassword'].value) {
      // enable form
      this.isChanging = false;
      // toast
      Toastify(
        {
          text: 'Confirm password does not match',
          backgroundColor: 'linear-gradient(to right, #ff416c, #ff4b2b)',
          duration: 3000,
          close: true,
          gravity: 'top',
          position: 'right',
          stopOnFocus: true
        }
      ).showToast();
      return;
    }

    // change password
    this.userService.changePassword(user)
      .then(() => {
        this.isChanging = false;
        // enable form
        form.reset();
      })
  }
}
