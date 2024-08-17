import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterStateSnapshot } from '@angular/router';
import { filter } from 'rxjs';
import { NavbarComponent } from "./components/navbar/navbar.component";
import "toastify-js/src/toastify.css"
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { PreloadImagesService } from './services/preloadimages.service';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule, NavbarComponent, CommonModule]
})
export class AppComponent {
  title = 'AllStar';

  constructor(private authService: AuthService, private router: Router, private preloadImagesService: PreloadImagesService) { }

  isAdmin = false;

  ngOnInit() {
    // preload images in folder /assets/images
    this.preloadImagesService.preloadImages([
      '/assets/images/bg.png',
      '/assets/images/EaEb.png',
      '/assets/images/natsu.svg',
      '/assets/images/RaRb.png',
      '/assets/images/rem.svg'
    ])


    // check if admin
    this.isAdmin = this.authService.isAdmin();

    // check if not login and path is 'join'' or 'signin' or 'signup'
    if (window.location.href.includes("/auth")) {
      return;
    }

    // log path url
    if (this.isAdmin) {
      // check path only /admin/* another path will redirect to /admin
      if (!window.location.href.includes('admin') && !window.location.href.includes('profile')) {
        this.router.navigate(['/admin/dashboard']);
      }
    }
  }
}
