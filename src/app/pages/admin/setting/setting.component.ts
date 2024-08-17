import Toastify from 'toastify-js';
import { Component, OnInit, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUser,
  faChartColumn,
  faMedal,
  faFileContract,
  faRightFromBracket,
  faImage,
  faHourglassHalf
} from '@fortawesome/free-solid-svg-icons';
import { Router, RouterModule } from '@angular/router';
import { SettingsService } from '../../../services/api/settings.service';


interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatSelectModule,
    FontAwesomeModule,
    RouterModule,
  ],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss'
})
export class SettingComponent implements OnInit {
  faUser = faUser;
  faChartColumn = faChartColumn;
  faMedal = faMedal;
  faFileContract = faFileContract;
  faRightFromBracket = faRightFromBracket;
  faImage = faImage;
  faHourglassHalf = faHourglassHalf;

  router = inject(Router);
  settingsService = inject(SettingsService);

  oldValue!: number;
  newValue!: number;

  async ngOnInit(): Promise<void> {
    this.oldValue = await this.settingsService.getASTime();
    this.newValue = this.oldValue;
  }

  async updateASTime() {
    if (this.oldValue === this.newValue) {
      // toast
      Toastify({
        text: 'No change detected',
        backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)',
      }).showToast();
    }

    await this.settingsService.updateASTime(this.newValue);
    this.oldValue = await this.settingsService.getASTime();
  }
}



