import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const loggedIn = this.authService.loggedIn();
    const currentUrl = state.url;

    // check if not login and path is 'join'' or 'signin' or 'signup'
    // console.log(loggedIn, currentUrl)
    if (loggedIn && currentUrl.includes("/auth")) {
      this.router.navigate(['/home']);
      return false;
    }
    else if (!loggedIn && currentUrl.includes("/auth")) {
      return true
    }

    // check if admin
    const isAdmin = this.authService.isAdmin();
    if (isAdmin) {
      // check path only /admin/* another path will redirect to /admin
      if (!currentUrl.includes('/admin') && !currentUrl.includes('/profile')) {
        this.router.navigate(['/admin/dashboard']);
      }
      return true
    }
    else {
      if (currentUrl.includes('/admin')) {
        this.router.navigate(['/home']);
      }
    }


    if (loggedIn) {
      return true;
    }

    this.router.navigate(['/home']);
    return false;
  }


}
