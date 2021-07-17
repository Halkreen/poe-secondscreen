import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { Gem } from '../../types/gem';
import { Link } from '../../types/link';
import { gemData } from '../../utils/gems';

@Component({
  selector: 'app-gear',
  templateUrl: './gear.component.html',
  styleUrls: ['./gear.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GearComponent implements OnChanges {
  @Input() public icon: string;
  @Input() public links: Link[];
  @Input() public gems: Gem[];

  public rewardsList = [];

  constructor(private readonly dialogService: DialogService) {}

  public ngOnChanges(): void {
    const className = this.dialogService.classSubject$.getValue();
    this.rewardsList = this.gems.map((gem) => {
      const gemAssociated = gemData.find(
        (gemdata) =>
          gemdata.name
            .toLowerCase()
            .replace(/ /g, '')
            .replace(/support/g, '') ===
          gem.gemName
            .toLowerCase()
            .replace(/ /g, '')
            .replace(/support/g, '')
      );

      if (!gemAssociated?.classes.includes(className)) {
        return {};
      }

      return {
        name: gem.gemName,
        npc: gemAssociated.npc,
        quest: gemAssociated.questReward,
      };
    });
  }

  public rewardSentence(gemName: string): string {
    const rewards = this.rewardsList.find((reward) => reward.name === gemName);
    if (!rewards) {
      return null;
    }
    return `${rewards.npc} (${rewards.quest})`;
  }
}
