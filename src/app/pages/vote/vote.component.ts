import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CardData } from '../../models/card-data';
import { faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CardComponent } from '../../components/card/card.component';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ImageService } from '../../services/api/image.service';
import { VoteService } from '../../services/api/vote.service';
import { VoteReq } from '../../models/api/vote-req';
import { AuthService } from '../../services/auth.service';
import { DeviceUUID } from 'device-uuid';
import { VoteRes } from '../../models/api/vote-res';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vote',
  standalone: true,
  imports: [CardComponent, CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './vote.component.html',
  styleUrl: './vote.component.scss'
})
export class VoteComponent implements OnInit, AfterViewInit {
  images: CardData[] = [];
  retryCount: number = 0;
  message: string = "Loading...";
  faSpinner = faSpinner;
  faTimes = faTimes;
  voting: boolean = false;
  allowShowResult: boolean = localStorage.getItem('allowShowResult') === 'true' ? true : false;
  @ViewChildren(CardComponent)
  public cardComponentQuery: QueryList<CardComponent> | undefined
  cardComponents: CardComponent[] = [];
  result: boolean = false;
  voteResult: VoteRes | null = null;
  body: VoteReq = {
    winnerId: 0,
    loserId: 0
  }
  htmlData: null | {
    winnerIndex: number,
    loserIndex: number
  } = null;

  constructor(private imageService: ImageService, private voteService: VoteService, private authService: AuthService) {
    this.vote = this.vote.bind(this);
  }
  ngAfterViewInit(): void {
    this.cardComponentQuery
      ?.changes
      .subscribe((comps: QueryList<CardComponent>) => {
        this.cardComponents = this.cardComponentQuery?.toArray() || []
      });

    // log
  }

  ngOnInit(): void {
    this.setup();
    this.voting = false;
  }

  async setup() {
    if (this.retryCount > 3) {
      this.message = "No Image Enough For You. Please try again later.";
      return
    }
    this.images = await this.imageService.getImageRandom();

    if (this.images.length < 2) {
      // delay 1 sec
      await new Promise(resolve => setTimeout(resolve, 1000));
      // try again
      this.retryCount++;
      this.message = "Retrying... " + this.retryCount;
      this.setup();
    }
  }

  async vote(image: CardData) {
    if (this.voting || this.result) return;
    if (this.result) return;

    // get winner is image
    const winner = this.images.find((i) => i.id === image.id)!;
    const loser = this.images.find((i) => i.id !== image.id)!;


    // insert voting record
    this.body = {
      winnerId: winner.id,
      loserId: loser.id
    }

    this.htmlData = {
      winnerIndex: this.images.indexOf(winner),
      loserIndex: this.images.indexOf(loser),
    }

    this.voting = true;
    this.voteResult = await this.voteService.vote(this.body);
    if (this.voteResult && this.allowShowResult) {
      this.result = true;
    } else if (this.voteResult) {
      this.showDamage()
      // wait 1.6 sec
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.images = []
      this.retryCount = 0;
      this.setup();
      this.voting = false;
    }
  }

  showDamage() {
    if (!this.voteResult) return
    this.cardComponents.find((c) => c.data.id === this.body.winnerId)?.showDamage((this.voteResult.winner.newScore - this.voteResult.winner.oldScore));
    this.cardComponents.find((c) => c.data.id === this.body.loserId)?.showDamage((this.voteResult.loser.newScore - this.voteResult.loser.oldScore));
  }

  async closeResult() {
    document.body.style.overflow = 'auto';
    this.result = false;
    if (this.voteResult) {
      this.showDamage()
    }
    // wait 1.6 sec
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.images = []
    this.retryCount = 0;
    this.setup();
    this.voting = false;
  }

  toggle($event: Event) {
    const checkedBox: HTMLInputElement = $event.target as HTMLInputElement;
    this.allowShowResult = checkedBox.checked;
    localStorage.setItem('allowShowResult', this.allowShowResult ? 'true' : 'false');
  }
}
