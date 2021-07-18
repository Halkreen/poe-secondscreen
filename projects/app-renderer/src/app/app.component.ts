import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { EMPTY, Observable, Subject } from 'rxjs';
import { debounceTime, skip, switchMap, takeUntil } from 'rxjs/operators';
import { DialogService } from './services/dialog.service';
import { LevelService } from './services/level.service';
import { CharactersData } from './types/character-data';
import { ItemToLookFor } from './types/itemToLookFor';
import { LevelingData } from './types/leveling-data';
import { Notable } from './types/notable';
import { findNotableData } from './utils/json-formatter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnDestroy, OnInit, AfterViewInit {
  public data: LevelingData[] = [];
  public notables: Notable[] = [];
  public items: ItemToLookFor[] = [];

  public currentIndex = 0;

  public nextStep: LevelingData = null;
  public currentStep: LevelingData = null;
  public previousStep: LevelingData | null = null;

  public levelThresholds: number[] = [];
  public firstTime = true;
  public firstEmit = true;

  public level$: Observable<number> = this.levelService.characterLevel$;
  public passivePoints$: Observable<number> =
    this.levelService.characterNotable$;
  public destroy$: Subject<void> = new Subject<void>();

  constructor(
    private readonly levelService: LevelService,
    private readonly dialogService: DialogService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  public ngAfterViewInit(): void {
    this.dialogService.sendApplicationReady();
  }

  public ngOnInit(): void {
    this.dialogService.data$
      .pipe(
        skip(1),
        switchMap((data: CharactersData) => {
          if (!data || !data.gearing || !data.notables) {
            return EMPTY;
          }
          this.firstEmit = true;
          this.setInitialData(data);
          return this.levelService.characterLevel$;
        }),
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe((level: number) => {
        this.setInitialSteps(level, this.firstEmit);
        if (this.hasNoNextSteps() || !this.shouldGoToNextSection(level)) {
          this.cdr.markForCheck();
          return;
        }

        this.goToNextStep();
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

  public setInitialData(data: CharactersData): void {
    this.data = data.gearing.sort((a, b) => a.level - b.level);
    this.levelThresholds = this.data.map((data1: LevelingData) => data1.level);
    this.notables = data.notables.map(findNotableData);
    this.items = data.itemsToLookFor;

    if (this.firstTime) {
      this.firstTime = false;
    } else {
      this.levelService.resetData();
    }
  }

  public goToNextStep(): void {
    this.previousStep = this.currentStep;
    this.currentIndex++;
    this.currentStep = this.data[this.currentIndex];
    this.nextStep = this.hasNoNextSteps()
      ? null
      : this.data[this.currentIndex + 1];
    this.cdr.markForCheck();
  }

  public setInitialSteps(level: number, firstEmit: boolean): void {
    if (!firstEmit) {
      return;
    }
    this.firstEmit = false;

    if (!this.data || !this.data.length) {
      return;
    }

    if (level === 1) {
      this.nextStep = this.data.length <= 1 ? null : this.data[1];
      this.currentStep = this.data[0];
      this.previousStep = null;
      this.currentIndex = 0;
      return;
    }

    let currentStep = 0;
    let lastStep = false;
    let firstStep = false;

    for (let i = 0; i < this.data.length; i++) {
      firstStep = i === 0;
      if (i === this.data.length - 1) {
        lastStep = true;
        currentStep = i;
        break;
      }
      if (level >= this.data[i].level && level < this.data[i + 1].level) {
        currentStep = i;
        break;
      }
    }
    this.currentIndex = currentStep;
    this.previousStep = firstStep ? null : this.data[currentStep - 1];
    this.currentStep = this.data[currentStep];
    this.nextStep = this.data[currentStep + 1];
  }
}
