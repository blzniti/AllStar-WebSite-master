import { Injectable } from '@angular/core';
import { Constants } from '../config/constants';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Toastify from 'toastify-js'
import { AuthRes } from '../models/auth/auth-res';
import { SignInReq } from '../models/auth/sign-in-req';
import { jwtDecode } from "jwt-decode";
import { DeviceUUID } from 'device-uuid';
import { userDataToken } from '../models/auth/userDataToken';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private constants: Constants, private http: HttpClient, private router: Router) { }

  async signUpUser(user: FormData): Promise<void> {
    try {
      const data = await lastValueFrom(this.http.post(this.constants.API_ENDPOINT + '/auth/register', user));
      const resp: AuthRes = data as AuthRes;
      if (resp.status === 'ok' && resp.token) {
        Toastify({
          text: 'User registered successfully',
          backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
        }).showToast();

        // set token
        localStorage.setItem('token', resp.token);

        window.location.href = '/';
      } else {
        Toastify({
          text: 'User registration failed',
          backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
        }).showToast();

        // message
        Toastify({
          text: resp.message,
          backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
        }).showToast();
      }
    } catch (error: any) {
      const resp: AuthRes = error.error as AuthRes;
      Toastify({
        text: 'User registration failed',
        backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
      }).showToast();

      // message
      Toastify({
        text: resp.message,
        backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
      }).showToast();
    }
  }

  async sinInUser(user: SignInReq): Promise<void> {
    try {
      const data = await lastValueFrom(this.http.post(this.constants.API_ENDPOINT + '/auth/login', user));
      const resp: AuthRes = data as AuthRes;
      if (resp.status === 'ok' && resp.token) {
        Toastify({
          text: 'User logged in successfully',
          backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
        }).showToast();

        // set token
        localStorage.setItem('token', resp.token);

        window.location.href = '/';
      } else {
        Toastify({
          text: 'User login failed',
          backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
        }).showToast();

        // message
        Toastify({
          text: resp.message,
          backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
        }).showToast();
      }
    } catch (error: any) {
      const resp: AuthRes = error.error as AuthRes;
      Toastify({
        text: 'User login failed',
        backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
      }).showToast();

      // message
      Toastify({
        text: resp.message,
        backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
      }).showToast();
    }
  }

  updateToken(token: string) {
    localStorage.setItem('token', token);
  }

  loggedIn() {
    return localStorage.getItem('token') !== null;
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/'
  }

  getCurrentUserData(refresh?: boolean) {
    const token = localStorage.getItem('token');
    // decode token
    if (refresh === undefined) refresh = true
    if (token) {
      const decoded = jwtDecode(token) as userDataToken

      // check expired
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        if (refresh) window.location.href = '/'
        return null;
      }

      return decoded;
    }
    return null;
  }

  getMachineCode(): string {
    // generate machine code
    const deviceUUID = new DeviceUUID();
    const machineCode = deviceUUID.get();
    return machineCode;
  }

  isAdmin() {
    const user = this.getCurrentUserData();
    if (user) {
      return user.type === 'admin';
    }
    return false;
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
