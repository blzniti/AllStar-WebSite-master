import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardData } from '../../models/card-data';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ImageRank } from '../../models/api/image-ranks';
import { faArrowDown, faArrowUp, faStar, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-rank-card',
  standalone: true,
  imports: [RouterModule, CommonModule, FontAwesomeModule],
  templateUrl: './rank-card.component.html',
  styleUrl: './rank-card.component.scss',
})
export class RankCardComponent {
  @Input() data!: ImageRank;
  @Input() color!: string;
  @Input() size: number = 1;

  faTrophy = faTrophy;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faStar = faStar;
  Math = Math;
}
