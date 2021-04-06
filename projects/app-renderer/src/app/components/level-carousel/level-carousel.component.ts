import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-level-carousel',
  templateUrl: './level-carousel.component.html',
  styleUrls: ['./level-carousel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelCarouselComponent implements OnChanges {
  @Input() public currentLevel: number;
  @Input() public levelThresholds: number[];

  public twoStepsBack: string | null = null;
  public oneStepBack: string | null = null;
  public currentStep: string | null = null;
  public oneStepFurther: string | null = null;
  public twoStepsFurther: string | null = null;

  public ngOnChanges(changes: SimpleChanges): void {
    let newCurrentStepIndex = null;

    for (let i = 0; i < this.levelThresholds.length; i++) {
      if (
        i === this.levelThresholds.length - 1 ||
        (this.currentLevel >= this.levelThresholds[i] &&
          this.currentLevel < this.levelThresholds[i + 1])
      ) {
        newCurrentStepIndex = i;
        break;
      }
    }

    this.twoStepsBack = this.levelThresholds[newCurrentStepIndex - 2]
      ? `Level ${this.levelThresholds[newCurrentStepIndex - 2]}`
      : '';
    this.oneStepBack = this.levelThresholds[newCurrentStepIndex - 1]
      ? `Level ${this.levelThresholds[newCurrentStepIndex - 1]}`
      : '';
    this.currentStep = this.levelThresholds[newCurrentStepIndex]
      ? `Level ${this.levelThresholds[newCurrentStepIndex]}`
      : '';
    this.oneStepFurther = this.levelThresholds[newCurrentStepIndex + 1]
      ? `Level ${this.levelThresholds[newCurrentStepIndex + 1]}`
      : '';
    this.twoStepsFurther = this.levelThresholds[newCurrentStepIndex + 2]
      ? `Level ${this.levelThresholds[newCurrentStepIndex + 2]}`
      : '';
  }
}
