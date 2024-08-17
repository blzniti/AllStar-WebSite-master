import { Component, OnInit, inject } from '@angular/core';
import { ImageStatResponse } from '../../../models/api/image-stats';
import { ImageService } from '../../../services/api/image.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-graph-image',
  standalone: true,
  imports: [CommonModule, NgChartsModule, FontAwesomeModule],
  templateUrl: './graph-image.component.html',
  styleUrl: './graph-image.component.scss'
})
export class GraphImageComponent implements OnInit {
  imageService = inject(ImageService);
  activatedRoute = inject(ActivatedRoute);

  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;

  lineChart: any = [];

  imageData: (ImageStatResponse & {
    today_score: number;
    today_rank: number;
    yesterday_score: number;
    yesterday_rank: number;
    last_update: string;
  }) | null = null;

  dates: string[] = [];
  Math = Math;

  async ngOnInit(): Promise<void> {
    const imageId = this.activatedRoute.snapshot.params['imageId'];
    if (imageId) {
      this.imageData = await this.imageService.getImagesStat(imageId) ?? null;
      if (!this.imageData) {
        window.location.href = '/home';
        return;
      }
    } else {
      window.location.href = '/home';
      return;
    }

    // =========== Chart ============
    // get the last 7 days
    this.dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      this.dates.push(date.toDateString());
    }

    console.log(this.dates)
    console.log(this.imageData)

    this.lineChartData = {
      labels: this.dates,
      datasets: [
        {
          label: 'Score',
          data: [...this.imageData.scores],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };

    let min: number = Number.MAX_VALUE;
    let max: number = Number.MIN_VALUE;

    //  y min start rounded 1490 -> 1400 minimum in list
    const scores = this.imageData.scores.filter((score: any) => !Number.isNaN(score));
    if (scores.length > 0) {
      const localMin = Math.min(...scores);
      const localMax = Math.max(...scores);
      min = Math.min(min, localMin);
      max = Math.max(max, localMax);
    }

    this.lineChartOptions = {
      responsive: true,
      layout: {
        padding: {
          top: 10,
          left: 10,
          right: 10,
          bottom: 10,
        },
      },
      scales: {
        x: {
          border: {
            color: 'pink',
          },
          title: {
            display: true,
            text: 'Date',
            color: '#fff',
            font: {
              size: 20,
              weight: 700,
            },
          },
          ticks: {
            color: '#f0f',
            font: {
              size: 10,
              weight: 700,
            },
          },
        },
        y: {
          border: {
            color: 'pink',
          },
          title: {
            display: true,
            text: 'Score',
            color: '#fff',
            font: {
              size: 20,
              weight: 700,
            },
          },
          min: Number(min) - 5,
          max: Number(max) + 5,
          ticks: {
            color: '#f00',
            font: {
              size: 10,
              weight: 700,
            },
          },
        },
      },
      plugins: {
        title: {
          display: true,
          color: '#fff',
          font: {
            size: 20,
            weight: 700,
          },
        },
        legend: {
          display: false,
          labels: {
            color: '#fff',
            font: {
              size: 20,
              weight: 700,
            },
          },
        },
        tooltip: {
          enabled: true,
          position: 'nearest',
        },
      },
    };
  }
  lineChartData!: ChartConfiguration['data'];
  lineChartType: ChartType = 'line';
  lineChartOptions: ChartConfiguration['options'] = {}
}


