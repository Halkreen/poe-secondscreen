import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-level-carousel',
  templateUrl: './level-carousel.component.html',
  styleUrls: ['./level-carousel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelCarouselComponent {
  @Input() public currentLevel: number;
  @Input() public levelSequence: number[];
}
