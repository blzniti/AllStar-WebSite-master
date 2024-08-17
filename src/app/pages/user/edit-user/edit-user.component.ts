import { AuthService } from './../../../services/auth.service';
import { Component, OnInit, inject } from '@angular/core';
import { faArrowDown, faCloudArrowDown } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../../services/api/user.service';
import { UserData } from '../../../models/api/userData';
import Toastify from 'toastify-js';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit {
  faArrowDown = faArrowDown;
  faCloudArrowDown = faCloudArrowDown;

  authService = inject(AuthService);
  userService = inject(UserService);

  imageFile: File | null = null;
  image: string | ArrayBuffer | null = null;
  oldUserData!: UserData;
  isChanging: boolean = false;

  async ngOnInit(): Promise<void> {
    const userId = this.authService.getCurrentUserData()!.userId;
    this.oldUserData = await this.userService.getUserById(userId);
    if (this.oldUserData) {
      this.image = this.oldUserData.image;
    }
  }

  async edit($event: Event) {
    $event.preventDefault();
    if (this.isChanging) return;
    // disable form
    this.isChanging = true;

    // get form
    const form = $event.target as HTMLFormElement;

    // user data
    let user = {
      userId: this.oldUserData.userId,
      displayName: form['displayName'].value,
      note: form['note'].value === '' ? null : form['note'].value,
    };

    // check something change
    if (user.displayName === this.oldUserData.displayName && user.note === this.oldUserData.note && !this.imageFile) {
      // enable form
      this.isChanging = false;
      // toast
      Toastify({
        text: "No changes made",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
        className: "info",
        gravity: 'bottom',
        position: 'right',
      }).showToast();
      return;
    }

    const formData = new FormData();
    if (this.imageFile) {
      formData.append('file', this.imageFile);
    }

    formData.append('userId', String(user.userId));

    // add if change
    if (user.displayName !== this.oldUserData.displayName) {
      formData.append('displayName', String(user.displayName));
    }

    // add if change
    if (user.note !== this.oldUserData.note) {
      formData.append('note', String(user.note));
    }

    // send request
    await this.userService.updateUser(formData);
    this.oldUserData = await this.userService.getUserById("" + user.userId);
    this.isChanging = false;
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
