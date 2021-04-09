import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { Gem } from '../../types/gem';
import { Link } from '../../types/link';

@Component({
  selector: 'app-gear',
  templateUrl: './gear.component.html',
  styleUrls: ['./gear.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GearComponent {
  @Input() public icon: string;
  @Input() public links: Link[];
  @Input() public gems: Gem[];
}
