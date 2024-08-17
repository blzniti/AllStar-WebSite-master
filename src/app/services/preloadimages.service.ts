import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PreloadImagesService {
  constructor(private http: HttpClient) { }

  preloadImages(imageUrls: string[]): void {
    imageUrls.forEach(url => {
      this.http.get(url, { responseType: 'blob' }).subscribe();
    });
  }
}
