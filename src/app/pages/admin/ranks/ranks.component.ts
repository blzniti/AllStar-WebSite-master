import { Component, OnInit, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { ImageRank } from '../../../models/api/image-ranks';
import { ImageService } from '../../../services/api/image.service';
import { RankCardComponent } from "../../../components/rank-card/rank-card.component";
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-ranks',
  standalone: true,
  templateUrl: './ranks.component.html',
  styleUrl: './ranks.component.scss',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    CommonModule,
    FontAwesomeModule,
    RouterModule,
    RankCardComponent,
    FontAwesomeModule
  ]
})
export class RanksComponent implements OnInit {
  images: ImageRank[] = []
  currentPage = 1;
  itemsPerPage = 8;
  totalPages!: number;
  faAngleRight = faAngleRight
  faAngleLeft = faAngleLeft
  imageService = inject(ImageService)
  async ngOnInit(): Promise<void> {
    this.images = await this.imageService.getRanks();
    this.totalPages = Math.ceil(this.images.length / this.itemsPerPage);
  }
}

