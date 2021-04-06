import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Link } from '../../types/link';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinksComponent {
  @Input() public links: Link[];
}
