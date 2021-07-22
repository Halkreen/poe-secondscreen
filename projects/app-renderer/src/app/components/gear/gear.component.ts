import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
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
  @Input() public questUsed: { name: string; quest: string }[];
  @Output() public newQuestUsed: Subject<{ name: string; quest: string }> =
    new Subject<{ name: string; quest: string }>();

  public rewardsList = [];
  public vendorList = [];

  constructor(
    private readonly dialogService: DialogService,
    public cdr: ChangeDetectorRef
  ) {}

  public ngOnChanges(): void {
    const className = this.dialogService.classSubject$.getValue();
    this.rewardsList = [];
    this.gems.forEach((gem) => {
      console.log('gem: ' + gem.gemName);
      const gemAssociated = gemData.find(
        (gemdata) =>
          gemdata.name
            .toLowerCase()
            .replace(/ /g, '')
            .replace(/support/g, '')
            // tslint:disable-next-line: quotemark
            .replace('%27', "'") ===
          gem.gemName
            .toLowerCase()
            .replace(/ /g, '')
            .replace(/support/g, '')
      );

      if (
        gemAssociated?.questRewardClasses.includes(className) &&
        !this.questUsed.find((q) => q.quest === gemAssociated.questReward)
      ) {
        console.log(gem.gemName + ' is not associated with quests');
        this.newQuestUsed.next({
          name: gem.gemName,
          quest: gemAssociated.questReward,
        });
        this.rewardsList.push({
          name: gem.gemName,
          quest: gemAssociated.questReward,
        });
      } else if (
        gemAssociated?.questRewardClasses.includes(className) &&
        this.questUsed.find((q) => q.quest === gemAssociated.questReward)
          .name === gem.gemName
      ) {
        console.log(gem.gemName + ' is associated with quests but it is ok');

        this.rewardsList.push({
          name: gem.gemName,
          quest: gemAssociated.questReward,
        });
      }

      if (!gemAssociated?.vendorClasses.includes(className)) {
        this.vendorList.push({
          name: gem.gemName,
          cost: gemAssociated.gemCostUnit,
        });
      }

      this.vendorList.push({
        name: gem.gemName,
        vendor: gemAssociated.vendor,
        cost: gemAssociated.gemCostUnit,
      });
    });
  }

  public rewardSentence(
    rewardsList: any[],
    vendorList: any[],
    gemName: string
  ): string {
    console.log('reward', rewardsList);
    const rewards = rewardsList.find((reward) => reward.name === gemName);
    if (rewards) {
      // tslint:disable-next-line: quotemark
      return rewards.quest.replace('%27', "'");
    }

    const quests = vendorList.find((reward) => reward.name === gemName);
    if (quests) {
      if (quests.vendor && quests.vendor !== '') {
        // tslint:disable-next-line: quotemark
        return `${quests.vendor} (${quests.cost.replace('%27', "'")})`;
      }
      // tslint:disable-next-line: quotemark
      return `Siosa (${quests.cost.replace('%27', "'")})`;
    }
  }
}
