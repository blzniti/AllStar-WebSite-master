import { AuthService } from './../../../services/auth.service';
import { UserService } from '../../../services/api/user.service';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { faChartLine, faEdit, faPlus, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserData } from '../../../models/api/userData';
import { ImageRank } from '../../../models/api/image-ranks';
import { ImageService } from '../../../services/api/image.service';
import { RankCardComponent } from "../../../components/rank-card/rank-card.component";
import Toastify from 'toastify-js';

@Component({
  selector: 'app-new-profile',
  standalone: true,
  templateUrl: './new-profile.component.html',
  styleUrl: './new-profile.component.scss',
  imports: [CommonModule, FontAwesomeModule, RankCardComponent, RouterModule]
})
export class NewProfileComponent implements OnInit {

  userService = inject(UserService)
  imageService = inject(ImageService)
  activateRoute = inject(ActivatedRoute)
  authService = inject(AuthService);

  faSpinner = faSpinner;
  faPlus = faPlus;
  faEdit = faEdit;
  faTrash = faTrash;
  faChartLine = faChartLine;

  user!: UserData & { images?: ImageRank[] };
  isOwnProfile!: boolean;

  async ngOnInit(): Promise<void> {
    try {

      // get user id from /:userId
      const userId = this.activateRoute.snapshot.params['userId'] || null;

      // get user data
      this.user = await this.userService.getUserById(userId);

      // get user's images
      this.user.images = await this.imageService.getUserImages(userId);

      // check if this is own profile
      this.isOwnProfile = this.authService.getCurrentUserData()?.userId == userId;
    }

    catch (err) {
      // if user not found
      if (!this.user) {
        // toast
        Toastify({
          text: "User not found",
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
          className: "info",
          gravity: 'bottom',
          position: 'right',
        }).showToast();
        window.location.href = '/';
      }
    }
  }

  async delete($event: Event, image: ImageRank) {
    $event.preventDefault();
    // confirm
    if (!confirm('Are you sure you want to delete this image?')) return;

    // delete image
    await this.imageService.deleteImage(image.imageId);
    // update user.images
    this.user.images = await this.imageService.getUserImages(this.user.userId);
  }
}
