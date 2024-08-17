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
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserData } from '../../../models/api/userData';
import { ImageRank } from '../../../models/api/image-ranks';
import { ImageService } from '../../../services/api/image.service';

@Component({
  selector: 'app-profile2',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterModule],
  templateUrl: './profile2.component.html',
  styleUrl: './profile2.component.scss',
})
export class Profile2Component implements OnInit {
  faTrophy = faTrophy;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faHeart = faHeart;
  faEllipsisVertical = faEllipsisVertical;
  Math = Math;


  user!: UserData & { images?: ImageRank[] };
  userService = inject(UserService)
  imageService = inject(ImageService)
  activateRoute = inject(ActivatedRoute)

  async ngOnInit(): Promise<void> {
    // get user id from /:userId
    const userId = this.activateRoute.snapshot.params['userId'] || null;

    // get user data
    this.user = await this.userService.getUserById(userId);

    // get user's images
    this.user.images = await this.imageService.getUserImages(userId);
  }

  items = Array(5)
    .fill(0)
    .map(() => ({ isMenuOpen: false }));
}
