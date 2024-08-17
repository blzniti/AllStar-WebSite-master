import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { faChartColumn, faFileContract, faMedal, faRightFromBracket, faUser, faHourglassHalf, faSliders } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, FontAwesomeModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  faRightFromBracket = faRightFromBracket;
  faChartColumn = faChartColumn;
  faUser = faUser;
  faMedal = faMedal;
  faSliders = faSliders;
  faHourglassHalf = faHourglassHalf;
  faFileContract = faFileContract;

  user: {
    userId: string,
    username: string,
    image: string,
    iat: number,
    exp: number
  } | null = null;

  constructor(private authService: AuthService, public router: Router) { }

  ngOnInit(): void {
    if (this.authService.loggedIn()) {
      this.user = this.authService.getCurrentUserData();
    }
    else {
      // go to /auth/logout
      this.authService.logout();
    }
  }
}
