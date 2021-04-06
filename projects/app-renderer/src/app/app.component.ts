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
