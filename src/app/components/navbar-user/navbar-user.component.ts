import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar-user',
  standalone: true,
  imports: [FontAwesomeModule, RouterModule, CommonModule],
  templateUrl: './navbar-user.component.html',
  styleUrl: './navbar-user.component.scss',
})
export class NavbarUserComponent implements OnInit {
  faBars = faBars;
  faTimes = faTimes;
  faUser = faUser;
  isOpened: boolean = false;
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
