import { lastValueFrom } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { AdminUsers } from '../../models/admin/user';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../config/constants';
import { APIResponse } from '../../models/api-res';
import Toastify from 'toastify-js';
import { AuthService } from '../auth.service';
import { UserData } from '../../models/api/userData';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http: HttpClient = inject(HttpClient);
  constants: Constants = inject(Constants)
  authService: AuthService = inject(AuthService);

  // GET /api/user
  async getUsers(): Promise<AdminUsers[]> {
    const resp: APIResponse = await lastValueFrom(this.http.get(this.constants.API_ENDPOINT + '/user')) as APIResponse;
    if (resp) {
      return resp.data as AdminUsers[]; // Assuming the response data is an array
    }

    return [];
  }

  // GET /api/user/:userId
  async getUserById(userId: string): Promise<UserData> {
    const token = localStorage.getItem('token');
    if (!token) {
      return {} as UserData;
    }

    // jwt auth header
    const headers = { 'Authorization': `Bearer ${token}` }

    const resp: APIResponse = await lastValueFrom(this.http.get(this.constants.API_ENDPOINT + `/user/${userId}`, { headers: headers })) as APIResponse;
    if (resp) {
      return resp.data as UserData;
    }

    return {} as UserData;
  }

  // PUT /api/user/:userId
  async changePassword(user: { oldPassword: string, newPassword: string }): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    // jwt auth header
    const headers = { 'Authorization': `Bearer ${token}` }

    // get userData
    let userId = this.authService.getCurrentUserData()?.userId;
    // check userId
    if (!userId) {
      return;
    }
    try {
      const resp: APIResponse = await lastValueFrom(this.http.put(this.constants.API_ENDPOINT + `/user/chnagepasswrod`, { ...user, userId: userId }, { headers: headers })) as APIResponse;
      if (resp.status === 'ok') {
        // toast
        Toastify({
          text: resp.message,
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          stopOnFocus: true,
        }).showToast();
      }
    } catch (err: any) {
      const resp: APIResponse = err.error as APIResponse;
      // toast
      Toastify({
        text: resp.message,
        backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
      }).showToast();
    }
  }

  async updateUser(formData: FormData) {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    // jwt auth header
    const headers = { 'Authorization': `Bearer ${token}` }

    // get userData
    let userId = this.authService.getCurrentUserData()?.userId;
    // check userId
    if (!userId) {
      return;
    }

    try {
      const resp: APIResponse & { token?: string } = await lastValueFrom(this.http.put(this.constants.API_ENDPOINT + `/user/${userId}`, formData, { headers: headers })) as APIResponse & { token?: string };
      if (resp.status === 'ok') {
        // toast
        Toastify({
          text: resp.message,
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          stopOnFocus: true,
        }).showToast();

        // update token
        if (resp.token) {
          this.authService.updateToken(resp.token);
        }
      }
    } catch (err: any) {
      const resp: APIResponse = err.error as APIResponse;
      // toast
      Toastify({
        text: resp.message,
        backgroundColor: "linear-gradient(to right, #ff416c, #ff4b2b)",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
      }).showToast();
    }
  }
}
