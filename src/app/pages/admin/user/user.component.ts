import { UserService } from './../../../services/api/user.service';
import { Component, OnInit, inject } from '@angular/core';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminUsers } from '../../../models/admin/user';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    FontAwesomeModule,
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  faAngleRight = faAngleRight
  faAngleLeft = faAngleLeft

  userService = inject(UserService)

  users: AdminUsers[] = [];
  userResults: AdminUsers[] = [];
  searchText: string = ''
  currentPage = 1;
  itemsPerPage = 10;
  totalPages!: number;
  window = window;

  async ngOnInit(): Promise<void> {
    this.users = await this.userService.getUsers();
    this.userResults = this.users;
    this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
  }

  search() {
    this.userResults = this.users.filter((user) => {
      return user.username.toLowerCase().includes(this.searchText.toLowerCase());
    });
    this.totalPages = Math.ceil(this.userResults.length / this.itemsPerPage);
    this.currentPage = 1
  }
}
