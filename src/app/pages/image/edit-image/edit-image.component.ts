import { Component, OnInit, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowDown, faCloudArrowDown } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../services/auth.service';
import { ImageService } from '../../../services/api/image.service';
import Toastify from 'toastify-js';
import { ActivatedRoute } from '@angular/router';
import { ImageData } from '../../../models/api/image-data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-image',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, FontAwesomeModule],
  templateUrl: './edit-image.component.html',
  styleUrl: './edit-image.component.scss'
})
export class EditImageComponent implements OnInit {
  faArrowDown = faArrowDown;
  faCloudArrowDown = faCloudArrowDown;

  authService = inject(AuthService);
  imageService = inject(ImageService);
  activatedRoute = inject(ActivatedRoute);

  imageFile: File | null = null;
  image: string | ArrayBuffer | null = null;
  oldData!: ImageData | null;
  isChanging: boolean = false;

  async ngOnInit(): Promise<void> {
    const imageId = this.activatedRoute.snapshot.params['imageId'];
    this.oldData = await this.imageService.getImageById(imageId) || null;
    if (this.oldData) {
      this.image = this.oldData.imageURL;
    }

    if (this.oldData?.userId !== this.authService.getCurrentUserData(false)?.userId) {
      // toast
      Toastify({
        text: "You are not allowed to edit this image",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
        className: "info",
        gravity: 'bottom',
        position: 'right',
      }).showToast();
      window.location.href = '/';
      return;
    }
  }

  async update($event: Event) {
    $event.preventDefault();
    if (this.isChanging || !this.oldData) return;
    this.isChanging = true;
    // toast
    Toastify({
      text: "Updating...",
      backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
      className: "info",
      gravity: 'bottom',
      position: 'right',
    }).showToast();

    // get form
    const form = $event.target as HTMLFormElement;
    const data = {
      imageId: this.oldData.id,
      name: form['imageName'].value as string,
      image: this.imageFile,
    }

    // check somethings change name or image
    if (this.oldData.name == data.name && !this.imageFile) {
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

    // create form data
    const formData = new FormData();
    if (data.image) {
      formData.append('file', data.image);
    }

    formData.append('name', data.name);
    formData.append('userId', this.authService.getCurrentUserData(false)?.userId ?? '');

    // update image
    await this.imageService.update(formData, data.imageId);

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
