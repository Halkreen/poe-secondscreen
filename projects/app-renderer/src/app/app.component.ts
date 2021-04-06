import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { DialogService } from './services/dialog.service';
import { LevelService } from './services/level.service';
import { LevelingData } from './types/leveling-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnDestroy, OnInit {
  public data: LevelingData[] = [];

  public currentIndex = 0;

  public nextStep: LevelingData = null;
  public currentStep: LevelingData = null;
  public previousStep: LevelingData | null = null;

  public levelThresholds: number[] = [];

  public level$: Observable<number> = this.levelService.characterLevel$;
  public destroy$: Subject<void> = new Subject<void>();

  constructor(
    private readonly levelService: LevelService,
    private readonly dialogService: DialogService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.dialogService.data$
      .pipe(
        switchMap((data) => {
          this.data = data;
          if (data && data.length) {
            this.nextStep = this.data.length <= 1 ? null : this.data[1];
            this.currentStep = this.data[0];
            this.levelThresholds = this.data.map(
              (data1: LevelingData) => data1.level
            );
          }
          return this.levelService.characterLevel$;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((level: number) => {
        if (this.hasNoNextSteps() || !this.shouldGoToNextSection(level)) {
          this.cdr.markForCheck();
          return;
        }

        this.previousStep = this.currentStep;
        this.currentIndex++;
        this.currentStep = this.data[this.currentIndex];
        this.nextStep = this.hasNoNextSteps()
          ? null
          : this.data[this.currentIndex + 1];
        this.cdr.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    if (this.destroy$) {
      this.destroy$.next();
      this.destroy$ = null;
    }
  }

  public hasNoNextSteps(): boolean {
    return !this.nextStep || this.currentIndex >= this.data.length - 1;
  }

  public shouldGoToNextSection(level: number): boolean {
    return level >= this.nextStep.level;
  }
}
