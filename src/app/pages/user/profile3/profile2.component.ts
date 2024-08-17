import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowDown,
  faArrowUp,
  faTrophy,
  faHeart,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../../services/api/user.service';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserData } from '../../../models/api/userData';
import { ImageRank } from '../../../models/api/image-ranks';
import { ImageService } from '../../../services/api/image.service';
import { AuthService } from '../../../services/auth.service';
import { ImageUserProfile, UserProfile } from '../../../models/api/user-profile';

@Component({
  selector: 'app-profile2',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterModule],
  templateUrl: './profile2.component.html',
  styleUrl: './profile2.component.scss',
})
export class Profile2Component implements OnInit {
  faTrophy = faTrophy;
  faHeart = faHeart;
  faArrowUp = faArrowUp;
  user: UserProfile | undefined;
  userService = inject(UserService)
  imageService = inject(ImageService)
  activateRoute = inject(ActivatedRoute)
  router = inject(Router)
  Math = Math;
  UID!:string;
  UIDToken!:string | undefined;

  constructor(private authService: AuthService) { }

  async ngOnInit(): Promise<void> {
    // get user id from /:userId
    const userId = this.activateRoute.snapshot.params['userId'] || null;
    this.UID = userId;
    this.UIDToken = this.authService.getCurrentUserData()?.userId;

    // if no user id, redirect to home
    if (!userId) {
      this.router.navigate(['/home']);
      return;
    }

    // get user data
    this.user = await this.userService.getUserById(userId) as UserProfile;

    // get user's images
    this.user.images = await this.imageService.getUserImages(userId) as ImageUserProfile[];

    // map images add isPortait
    this.user.images = await Promise.all(this.user.images.map(async (image) => {
      const img = new Image();
      img.src = image.imageURL;
      await new Promise<void>((resolve) => {
        img.onload = () => {
          image.isPortrait = img.width < img.height;
          resolve();
        };
      });
      return image;
    }));

  }
}
