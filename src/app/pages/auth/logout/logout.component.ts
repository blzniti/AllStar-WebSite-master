import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent implements OnInit {
  authService: AuthService = inject(AuthService);

  ngOnInit(): void {
    this.authService.logout();
  }

}
