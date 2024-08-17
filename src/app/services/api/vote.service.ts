import { Injectable, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../config/constants';
import { VoteReq } from '../../models/api/vote-req';
import { ImageService } from './image.service';
import { APIResponse } from '../../models/api-res';
import { VoteRes } from '../../models/api/vote-res';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  authService: AuthService = inject(AuthService);
  http: HttpClient = inject(HttpClient);
  constants: Constants = inject(Constants)
  imageService: ImageService = inject(ImageService)

  async vote(body: VoteReq) {
    const user = this.authService.getCurrentUserData(false);
    if (user) {
      body.userId = +user.userId;
    } else {
      // save machine code
      body.browserId = this.authService.getMachineCode();
    }

    // vote post
    let resp: APIResponse | undefined = await this.http.post<APIResponse>(this.constants.API_ENDPOINT + '/vote', body).toPromise()
    if (resp?.status === 'ok') {
      return resp.data as VoteRes
    }

    return null
  }
}
