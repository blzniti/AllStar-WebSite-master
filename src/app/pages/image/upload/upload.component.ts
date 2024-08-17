import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowDown,
  faCloudArrowDown,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../services/auth.service';
import { ImageService } from '../../../services/api/image.service';
import { ImageUploadRequest } from '../../../models/api/image-upload-req';
import Toastify from 'toastify-js'
import { userDataToken } from '../../../models/auth/userDataToken';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [MatButtonModule, FontAwesomeModule, RouterModule, CommonModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
})
export class UploadComponent implements OnInit {
  user: userDataToken | null = this.authService.getCurrentUserData();

  constructor(
    private authService: AuthService,
    private imageService: ImageService
  ) { }

  ngOnInit(): void {
    if (!this.authService.loggedIn()) {
      this.authService.logout();
    }
  }

  faArrowDown = faArrowDown;
  faCloudArrowDown = faCloudArrowDown;
  image: string | ArrayBuffer | null = null;
  imageFile: File | null = null;
  uploading: boolean = false;
  async upload($event: SubmitEvent) {
    // handle form submission
    $event.preventDefault();

    if (this.uploading) return;
    this.uploading = true;

    // toast upload
    Toastify({
      text: "Uploading...",
      backgroundColor: "linear-gradient(to right, #00d09b, #96c93d)",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
    }).showToast();


    // if user is not logged in
    if (!this.user) {
      // toast
      Toastify({
        text: "User not logged in",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
      }).showToast();
      this.uploading = false;
      return;
    }

    // if image is not uploaded
    if (!this.imageFile) {
      // toast
      Toastify({
        text: "Image not uploaded",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
      }).showToast();
      this.uploading = false;

      return;
    }

    const form = $event.target as HTMLFormElement;
    // create form-data
    const formData = new FormData();
    formData.append('file', this.imageFile);
    formData.append('userId', this.user.userId.toString());
    formData.append('name', form['imageName'].value.trim());
    // formData.append('series_name', form['seriesName'].value.trim());
    // formData.append(
    //   'description',
    //   form['description'].value.trim() === ''
    //     ? ''
    //     : form['description'].value.trim()
    // );

    // call allStarService.createPost jsonData
    await this.imageService.create(formData);

    // reset form
    form.reset();
    this.image = null;
    this.imageFile = null;
    this.uploading = false;
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
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
      }).showToast();
      this.imageFile = null;
      // reset input
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
