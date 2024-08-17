import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { NavbarUserComponent } from '../navbar-user/navbar-user.component';
import { AuthService } from '../../services/auth.service';
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [RouterModule, FontAwesomeModule, FlexLayoutModule, CommonModule, NavbarUserComponent],
})
export class NavbarComponent implements OnInit {
  faBars = faBars;
  faTimes = faTimes;
  isOpened: boolean = false;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  constructor(private authService: AuthService) { }
  ngOnInit(): void {
    this.isLoggedIn = this.authService.loggedIn();
    this.isAdmin = this.authService.isAdmin();
  }
}
