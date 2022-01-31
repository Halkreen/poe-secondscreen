import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomWindow } from 'my-api';
import * as Pako from 'pako';
import * as bfr from '../../../../../node_modules/buffer/index';
import { CharactersData } from '../types/character-data';
import { LevelingData } from '../types/leveling-data';
import { gemData } from '../utils/gems';

@Injectable({
  providedIn: 'root',
})
export class PobService {
  private window: CustomWindow;

  private httpOptions = {
    headers: new HttpHeaders({
      Accept: 'text/html, application/xhtml+xml, */*',
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    responseType: 'text' as any,
  };

  constructor(private readonly http: HttpClient) {
    this.window = window as any as CustomWindow;
  }

  public parsePob(
    pobLink: string,
    characterName: string,
    filePath: string,
    className: string,
    isPobbinLink: boolean = false
  ): void {
    if (isPobbinLink) {
      this.http.get<string>(pobLink, this.httpOptions).subscribe((res) => {
        this.handlePoBCode(
          res
            .split('<textarea data-hk=')[1]
            .split('</textarea>')[0]
            .split('readonly="">')[1],
          characterName,
          filePath,
          className
        );
      });
      return;
    }
    const splitLink = pobLink.split('https://pastebin.com/');
    const rawLink = 'https://pastebin.com/raw/' + splitLink[1];

    this.http.get<string>(rawLink, this.httpOptions).subscribe((res) => {
      this.handlePoBCode(res, characterName, filePath, className);
    });
  }

  public sendData(
    pobData: string,
    characterName: string,
    filePath: string,
    className: string
  ): void {
    if (this.window.api) {
      const client = this.setFilePath(filePath);
      this.window.api.sendToMain(
        'pobData ' +
          characterName +
          ' || ' +
          client +
          ' || ' +
          className +
          ' || ' +
          pobData
      );
    }
  }

  private setFilePath(path: string): string {
    if (localStorage.getItem('filePath') !== path) {
      localStorage.setItem('filePath', path);
    }
    return path;
  }

  private handlePoBCode(
    pobCode: string,
    characterName: string,
    filePath: string,
    className: string
  ): void {
    const pobBuffer = bfr.Buffer.from(pobCode, 'base64');
    const xmlCodeIntArray = Pako.inflate(pobBuffer);
    const decoder = new TextDecoder();

    const xml = new DOMParser().parseFromString(
      decoder.decode(xmlCodeIntArray),
      'text/xml'
    );

    const characterData = this.getCharacterDataFromGems(
      xml.querySelector('Skills')
    );

    characterData.passiveTree = xml
      .querySelector('Spec')
      .getAttribute('nodes')
      .split(',')
      .map((i) => parseInt(i, 10));

    characterData.masteries = xml
      .querySelector('Spec')
      .getAttribute('masteryEffects')
      .split('},{')
      .map((s) =>
        s
          .replace('{', '')
          .replace('}', '')
          .split(',')
          .map((m) => parseInt(m, 10))
      );

    this.sendData(
      JSON.stringify(characterData),
      characterName,
      filePath,
      className
    );
  }

  private getCharacterDataFromGems(gemsNode: Element): CharactersData {
    const characterData: CharactersData = {
      gearing: [],
    };

    let available4link = [
      { type: 'helmet', taken: 0 },
      { type: 'gloves', taken: 0 },
      { type: 'boots', taken: 0 },
    ];
    let available6link = [
      { type: 'two_handed', taken: 0 },
      { type: 'body_armor', taken: 0 },
    ];

    const skillGroups = gemsNode.querySelectorAll('Skill');

    const levelData: LevelingData[] = [];
    const gemGroupsByLevel = [];
    const allLevels = [];
    let currentLevel = null;

    skillGroups.forEach((skillGroup) => {
      if (
        skillGroup.getAttribute('label') &&
        skillGroup.getAttribute('label').startsWith('level')
      ) {
        currentLevel = parseInt(skillGroup.getAttribute('label').substr(5), 10);
        allLevels.push(currentLevel);
      } else {
        const gemGroup = [];
        let socketColors = '';
        skillGroup.querySelectorAll('Gem').forEach((gemNode) => {
          gemGroup.push(gemNode.getAttribute('nameSpec'));
          const socketColor = gemData.find(
            (g) =>
              g.name.replace(' Support', '') ===
              gemNode.getAttribute('nameSpec').trim()
          )?.socketColor;

          if (socketColor) {
            socketColors = socketColors.concat(socketColor);
          } else {
            socketColors = socketColors.concat('W');
          }
        });

        gemGroupsByLevel.push({
          level: currentLevel,
          gemGroup,
          socketColors,
          gemNumber: gemGroup.length,
        });
      }
    });

    if (!allLevels.length && gemGroupsByLevel.every((group) => !group.level)) {
      allLevels.push(1);
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < gemGroupsByLevel.length; i++) {
        gemGroupsByLevel[i].level = 1;
      }
    }

    console.log(gemGroupsByLevel);

    allLevels.forEach((level) => {
      available4link = [
        { type: 'helmet', taken: 0 },
        { type: 'gloves', taken: 0 },
        { type: 'boots', taken: 0 },
      ];
      available6link = [
        { type: 'body_armor', taken: 0 },
        { type: 'two_handed', taken: 0 },
      ];
      const relevantGemGroups = gemGroupsByLevel.filter(
        (g) => g.level === level
      );
      const gear = [];

      relevantGemGroups.sort((g1, g2) => g2.gemNumber - g1.gemNumber);

      relevantGemGroups.forEach((g) => {
        if (g.gemNumber === 6 || g.gemNumber === 5) {
          if (!available6link[0].taken) {
            gear.push({
              type: available6link[0].type,
              gems: g.gemGroup,
              sockets: [g.socketColors],
            });
            available6link[0].taken += g.gemNumber;
          } else if (!available6link[1].taken) {
            gear.push({
              type: available6link[1].type,
              gems: g.gemGroup,
              sockets: [g.socketColors],
            });
            available6link[1].taken += g.gemNumber;
          }
        } else if (g.gemNumber === 4) {
          if (!available4link[0].taken) {
            gear.push({
              type: available4link[0].type,
              gems: g.gemGroup,
              sockets: [g.socketColors],
            });
            available4link[0].taken += g.gemNumber;
          } else if (!available4link[1].taken) {
            gear.push({
              type: available4link[1].type,
              gems: g.gemGroup,
              sockets: [g.socketColors],
            });
            available4link[1].taken += g.gemNumber;
          } else if (!available4link[2].taken) {
            gear.push({
              type: available4link[2].type,
              gems: g.gemGroup,
              sockets: [g.socketColors],
            });
            available4link[2].taken += g.gemNumber;
          } else if (!available6link[0].taken) {
            gear.push({
              type: available6link[0].type,
              gems: g.gemGroup,
              sockets: [g.socketColors],
            });
            available6link[0].taken += g.gemNumber;
          } else if (!available6link[1].taken) {
            gear.push({
              type: available6link[1].type,
              gems: g.gemGroup,
              sockets: [g.socketColors],
            });
            available6link[1].taken += g.gemNumber;
          }
        } else if (g.gemNumber <= 3) {
          if (available6link[0].taken <= g.gemNumber) {
            gear.push({
              type: available6link[0].type,
              gems: g.gemGroup,
              sockets: [g.socketColors],
            });
            available6link[0].taken += g.gemNumber;
          } else if (!available6link[1].taken <= g.gemNumber) {
            gear.push({
              type: available6link[1].type,
              gems: g.gemGroup,
              sockets: [g.socketColors],
            });
            available6link[1].taken += g.gemNumber;
          } else if (!available4link[0].taken <= g.gemNumber) {
            gear.push({
              type: available4link[0].type,
              gems: g.gemGroup,
              sockets: [g.socketColors],
            });
            available4link[0].taken += g.gemNumber;
          } else if (!available4link[1].taken <= g.gemNumber) {
            gear.push({
              type: available4link[1].type,
              gems: g.gemGroup,
              sockets: [g.socketColors],
            });
            available4link[1].taken += g.gemNumber;
          } else if (!available4link[2].taken <= g.gemNumber) {
            gear.push({
              type: available4link[2].type,
              gems: g.gemGroup,
              sockets: [g.socketColors],
            });
            available4link[2].taken += g.gemNumber;
          }
        }
      });

      const mergedGear = [];

      const helmet = gear.filter((part) => part.type === 'helmet');
      const gloves = gear.filter((part) => part.type === 'gloves');
      const boots = gear.filter((part) => part.type === 'boots');
      const body = gear.filter((part) => part.type === 'body_armor');
      const weapon = gear.filter((part) => part.type === 'two_handed');

      if (helmet.length > 1) {
        const merged = helmet[0];

        helmet.forEach((item, key) => {
          if (key > 0) {
            merged.sockets = [...merged.sockets, ...item.sockets];
            merged.gems = [...merged.gems, ...item.gems];
          }
        });
        mergedGear.push(merged);
      } else if (helmet.length === 1) {
        mergedGear.push(helmet[0]);
      } else {
        mergedGear.push({ type: 'helmet', sockets: [], gems: [] });
      }

      if (gloves.length > 1) {
        const merged = gloves[0];

        gloves.forEach((item, key) => {
          if (key > 0) {
            merged.sockets = [...merged.sockets, ...item.sockets];
            merged.gems = [...merged.gems, ...item.gems];
          }
        });
        mergedGear.push(merged);
      } else if (gloves.length === 1) {
        mergedGear.push(gloves[0]);
      } else {
        mergedGear.push({ type: 'gloves', sockets: [], gems: [] });
      }

      if (boots.length > 1) {
        const merged = boots[0];

        boots.forEach((item, key) => {
          if (key > 0) {
            merged.sockets = [...merged.sockets, ...item.sockets];
            merged.gems = [...merged.gems, ...item.gems];
          }
        });
        mergedGear.push(merged);
      } else if (boots.length === 1) {
        mergedGear.push(boots[0]);
      } else {
        mergedGear.push({ type: 'boots', sockets: [], gems: [] });
      }

      if (body.length > 1) {
        const merged = body[0];

        body.forEach((item, key) => {
          if (key > 0) {
            merged.sockets = [...merged.sockets, ...item.sockets];
            merged.gems = [...merged.gems, ...item.gems];
          }
        });
        mergedGear.push(merged);
      } else if (body.length === 1) {
        mergedGear.push(body[0]);
      } else {
        mergedGear.push({ type: 'body_armor', sockets: [], gems: [] });
      }

      if (weapon.length > 1) {
        const merged = weapon[0];

        weapon.forEach((item, key) => {
          if (key > 0) {
            merged.sockets = [...merged.sockets, ...item.sockets];
            merged.gems = [...merged.gems, ...item.gems];
          }
        });
        mergedGear.push(merged);
      } else if (weapon.length === 1) {
        mergedGear.push(weapon[0]);
      } else {
        mergedGear.push({ type: 'two_handed', sockets: [], gems: [] });
      }

      levelData.push({
        level,
        gear: mergedGear,
      });
    });

    characterData.gearing = levelData;
    return characterData;
  }
}
