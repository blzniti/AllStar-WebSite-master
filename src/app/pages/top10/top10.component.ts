import { Component, OnInit, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowDown, faArrowUp, faSpinner, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { ImageService } from '../../services/api/image.service';
import { ImageRank } from '../../models/api/image-ranks';
import { RankCardComponent } from "../../components/rank-card/rank-card.component";
@Component({
  selector: 'app-top10',
  standalone: true,
  templateUrl: './top10.component.html',
  styleUrl: './top10.component.scss',
  imports: [FontAwesomeModule, CommonModule, MatTableModule, RankCardComponent]
})
export class Top10Component implements OnInit {
  faTrophy = faTrophy;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faSpinner = faSpinner;
  Math = Math;
  imageService = inject(ImageService);
  users: ImageRank[] = [];

  ngOnInit(): void {
    this.imageService.getTop10().then((data: ImageRank[]) => {
      this.users = data;
    });
  }
}
