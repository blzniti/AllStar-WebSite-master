import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Constants } from '../../config/constants';
import { AuthService } from '../auth.service';
import { lastValueFrom } from 'rxjs';
import { APIResponse } from '../../models/api-res';
import Toastify from 'toastify-js';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  http: HttpClient = inject(HttpClient);
  constants: Constants = inject(Constants)
  authService: AuthService = inject(AuthService);

  // GET /api/settings/ASTime
  async getASTime(): Promise<number> {
    const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` }

    const resp: APIResponse = await lastValueFrom(this.http.get(this.constants.API_ENDPOINT + `/settings/ASTime`, { headers: headers })) as APIResponse;
    if (resp) {
      return resp.data as number;
    }

    return -1;
  }

  // PUT Update /api/settings/ASTime
  async updateASTime(astime: number) {
    const headers = { 'Authorization': `Bearer ${this.authService.getToken()}` }
    const body = { astime: astime };
    const resp: APIResponse = await lastValueFrom(this.http.put(this.constants.API_ENDPOINT + `/settings/ASTime`, body, { headers: headers })) as APIResponse;
    Toastify({
      text: resp.message,
      backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
    }).showToast();
  }
}
