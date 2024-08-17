import { Component, OnInit, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faImage } from '@fortawesome/free-solid-svg-icons';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/api/user.service';
import { ImageService } from '../../../services/api/image.service';

const abbreviate = (num: number) => {
  if (num < 1000) {
    return num;
  }
  const units = ['k', 'M', 'B', 'T', 'Q']
  const unit = Math.min(4, Math.floor((num / 1000).toFixed(0).length / 3))
  const numStr = (num / Math.pow(1000, unit)).toFixed(1)
  return numStr + units[unit]
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    FontAwesomeModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  faUser = faUser;
  faImage = faImage;

  userService = inject(UserService)
  imageService = inject(ImageService)

  userCount: string | number = "NaN";
  imageCount: string | number = "NaN";

  async ngOnInit(): Promise<void> {
    const images = await this.imageService.getRanks();
    const users = await this.userService.getUsers();
    this.userCount = abbreviate(images.length) // shorten the number of images
    this.imageCount = abbreviate(users.length) // shorten the number of users
  }
}
