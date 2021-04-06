import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-gear',
  templateUrl: './gear.component.html',
  styleUrls: ['./gear.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GearComponent {}
