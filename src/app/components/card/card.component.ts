import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardData } from '../../models/card-data';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  animations: [
    trigger('damageAnimation', [
      state('show', style({ transform: 'translateY(-100%)', opacity: 1 })),
      state('void', style({ transform: 'translateY(0)', opacity: 0 })),
      transition('void => show', [
        style({ transform: 'translateY(0)', opacity: 0 }),
        animate('0.5s ease-in-out')
      ]),
      transition('show => void', [
        animate('0.5s ease-in-out', style({ transform: 'translateY(-100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class CardComponent implements OnInit {
  @Input() data!: CardData;
  @Input() color!: string;
  @Input() disabledName = false;
  @Input() callback?: (data: CardData) => void;

  damageText: string = '';
  damageState: string = 'void';

  ngOnInit(): void {
    if (!this.data) {
      // Fake
      this.data = {
        'id': 1,
        'userId': 1,
        'userImage': '1',
        'imageURL': 'string',
        'name': 'string',
        'username': 'string',
      }

    }

    // this.showDamage(10); // Test damage animation
  }



  showDamage(damage: number) {
    const damageCasted = damage.toFixed(4);
    this.damageText = '' + (damage > 0 ? "+" + damageCasted : damageCasted);
    this.damageState = 'show';

    // Reset damage text after a delay
    setTimeout(() => {
      this.damageState = 'void';
    }, 800); // Adjust the duration the damage text is visible (in milliseconds)
  }

}
