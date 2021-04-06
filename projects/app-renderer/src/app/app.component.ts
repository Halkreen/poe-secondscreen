import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LevelService } from './services/shortcut.service';
import { LevelingData } from './types/leveling-data';
import { SocketColor } from './types/socket-color.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnDestroy, OnInit {
  public dummyData: LevelingData[] = [
    {
      level: 1,
      gear: [
        {
          type: 'helmet',
          sockets: [
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.GREEN,
          ],
          gems: [
            'Stormblast Mine',
            'Added Lightning',
            'Swift Assembly',
            'Lesser Poison',
          ],
        },
        {
          type: 'body_armor',
          sockets: [
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.GREEN,
            SocketColor.RED,
            SocketColor.RED,
          ],
          gems: [
            'Stormblast Mine',
            'Added Lightning',
            'Swift Assembly',
            'Lesser Poison',
            'Fortify',
            'Leap Slam',
          ],
        },
        {
          type: 'gloves',
          sockets: [
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.GREEN,
          ],
          gems: [
            'Stormblast Mine',
            'Added Lightning',
            'Swift Assembly',
            'Lesser Poison',
          ],
        },
        {
          type: 'boots',
          sockets: [
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.GREEN,
          ],
          gems: [
            'Stormblast Mine',
            'Added Lightning',
            'Swift Assembly',
            'Lesser Poison',
          ],
        },
        {
          type: 'two_handed',
          sockets: [
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.GREEN,
            SocketColor.RED,
            SocketColor.RED,
          ],
          gems: [
            'Stormblast Mine',
            'Added Lightning',
            'Swift Assembly',
            'Lesser Poison',
            'Fortify',
            'Leap Slam',
          ],
        },
      ],
    },
    {
      level: 15,
      gear: [
        {
          type: 'helmet',
          sockets: [
            SocketColor.RED,
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.GREEN,
          ],
          gems: [
            'Leap Slam',
            'Added Lightning',
            'Swift Assembly',
            'Lesser Poison',
          ],
        },
        {
          type: 'body_armor',
          sockets: [
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.GREEN,
            SocketColor.RED,
            SocketColor.RED,
          ],
          gems: [
            'Stormblast Mine',
            'Added Lightning',
            'Swift Assembly',
            'Lesser Poison',
            'Fortify',
            'Leap Slam',
          ],
        },
        {
          type: 'gloves',
          sockets: [
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.GREEN,
          ],
          gems: [
            'Stormblast Mine',
            'Added Lightning',
            'Swift Assembly',
            'Lesser Poison',
          ],
        },
        {
          type: 'boots',
          sockets: [
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.GREEN,
          ],
          gems: [
            'Stormblast Mine',
            'Added Lightning',
            'Swift Assembly',
            'Lesser Poison',
          ],
        },
        {
          type: 'two_handed',
          sockets: [
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.GREEN,
            SocketColor.RED,
            SocketColor.RED,
          ],
          gems: [
            'Stormblast Mine',
            'Added Lightning',
            'Swift Assembly',
            'Lesser Poison',
            'Fortify',
            'Leap Slam',
          ],
        },
      ],
    },
    {
      level: 10,
      gear: [
        {
          type: 'helmet',
          sockets: [
            SocketColor.GREEN,
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.GREEN,
          ],
          gems: [
            'Toxic Rain',
            'Added Lightning',
            'Swift Assembly',
            'Lesser Poison',
          ],
        },
        {
          type: 'body_armor',
          sockets: [
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.GREEN,
            SocketColor.RED,
            SocketColor.RED,
          ],
          gems: [
            'Stormblast Mine',
            'Added Lightning',
            'Swift Assembly',
            'Lesser Poison',
            'Fortify',
            'Leap Slam',
          ],
        },
        {
          type: 'gloves',
          sockets: [
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.GREEN,
          ],
          gems: [
            'Stormblast Mine',
            'Added Lightning',
            'Swift Assembly',
            'Lesser Poison',
          ],
        },
        {
          type: 'boots',
          sockets: [
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.GREEN,
          ],
          gems: [
            'Stormblast Mine',
            'Added Lightning',
            'Swift Assembly',
            'Lesser Poison',
          ],
        },
        {
          type: 'two_handed',
          sockets: [
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.BLUE,
            SocketColor.GREEN,
            SocketColor.RED,
            SocketColor.RED,
          ],
          gems: [
            'Stormblast Mine',
            'Added Lightning',
            'Swift Assembly',
            'Lesser Poison',
            'Fortify',
            'Leap Slam',
          ],
        },
      ],
    },
  ].sort((a, b) => a.level - b.level);

  public currentIndex = 0;

  public nextStep: LevelingData =
    this.dummyData.length <= 1 ? null : this.dummyData[1];
  public currentStep: LevelingData = this.dummyData[0];
  public previousStep: LevelingData | null = null;

  public levelThresholds: number[] = this.dummyData.map((data) => data.level);

  public level$: Observable<number> = this.levelService.characterLevel$;
  public destroy$: Subject<void> = new Subject<void>();

  constructor(private readonly levelService: LevelService) {}

  public ngOnInit(): void {
    this.levelService.characterLevel$
      .pipe(takeUntil(this.destroy$))
      .subscribe((level: number) => {
        if (this.hasNoNextSteps() || !this.shouldGoToNextSection(level)) {
          return;
        }

        this.previousStep = this.currentStep;
        this.currentIndex++;
        this.currentStep = this.dummyData[this.currentIndex];
        this.nextStep = this.hasNoNextSteps()
          ? null
          : this.dummyData[this.currentIndex + 1];
      });
  }

  public ngOnDestroy(): void {
    if (this.destroy$) {
      this.destroy$.next();
      this.destroy$ = null;
    }
  }

  public hasNoNextSteps(): boolean {
    return !this.nextStep || this.currentIndex >= this.dummyData.length - 1;
  }

  public shouldGoToNextSection(level: number): boolean {
    return level >= this.nextStep.level;
  }
}
