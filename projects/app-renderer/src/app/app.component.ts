import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public dummyData: any = [
    {
      level: 10,
      gear: [
        {
          type: 'helmet',
          linksNumber: 4,
          sockets: ['B', 'B', 'B', 'G'],
          gems: [
            'Stormblast Mine',
            'Added Lightning',
            'Swift Assembly',
            'Lesser Poison',
          ],
        },
        {
          type: 'body_armor',
          linksNumber: 4,
          sockets: ['B', 'B', 'B', 'G', 'R', 'R'],
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
          linksNumber: 4,
          sockets: ['B', 'B', 'B', 'G'],
          gems: [
            'Stormblast Mine',
            'Added Lightning',
            'Swift Assembly',
            'Lesser Poison',
          ],
        },
        {
          type: 'boots',
          linksNumber: 4,
          sockets: ['B', 'B', 'B', 'G'],
          gems: [
            'Stormblast Mine',
            'Added Lightning',
            'Swift Assembly',
            'Lesser Poison',
          ],
        },
        {
          type: 'two_handed',
          linksNumber: 4,
          sockets: ['B', 'B', 'B', 'G', 'R', 'R'],
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
  ];
}
