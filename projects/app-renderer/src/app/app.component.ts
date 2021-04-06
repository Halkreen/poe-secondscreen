import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LevelingData } from './types/leveling-data';
import { SocketColor } from './types/socket-color.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public dummyData: LevelingData[] = [
    {
      level: 10,
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
  ];
}
