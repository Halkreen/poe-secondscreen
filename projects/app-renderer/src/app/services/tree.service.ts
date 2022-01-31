import { Injectable, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { passiveTree } from '../utils/skill-tree';
import { PassiveModalComponent } from '../components/passive-modal/passive-modal.component';
import { CustomWindow } from 'my-api';

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  private window: CustomWindow;
  public tree = '';
  public masteryData = [];
  public treeDisplayed = false;

  constructor(
    private readonly dialog: MatDialog,
    private readonly zone: NgZone
  ) {
    this.window = window as any as CustomWindow;
    if (this.window.api) {
      this.window.api.onMainMessage((data) => {
        if (data.startsWith('toggleTree')) {
          this.toggleTree();
        }
      });
    }
  }

  public getMasteryDataFromTree(
    nodeSkill: number,
    masteryEffect: number
  ): string {
    const nodes = Object.entries(passiveTree.nodes as object)
      .map((o) => o[1])
      .filter((o) => !!o.skill);
    return nodes
      .find((n) => n.skill === nodeSkill)
      .masteryEffects.find((m) => m.effect === masteryEffect)
      .stats.join(', ');
  }

  public setTree(allocatedPoints: number[], masteries: number[][]): void {
    const masteryColors = [
      '#f44336',
      '#e91e63',
      '#9c27b0',
      '#673ab7',
      '#3f51b5',
      '#2196f3',
      '#03a9f4',
      '#00bcd4',
      '#009688',
      '#4caf50',
      '#8bc34a',
      '#cddc39',
      '#ffeb3b',
      '#ffc107',
      '#ff9800',
      '#ff5722',
      '#795548',
      '#9e9e9e',
      '#607d8b',
    ];
    let masteryColorIndex = 0;

    const computeAngle = (radius, x1, y1, x2, y2) => {
      if (radius === 0) {
        return 0;
      }
      const halfDistance =
        Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) / 2;

      return Math.round(2 * Math.asin(halfDistance / radius) * (180 / Math.PI));
    };

    const getCurveWay = (nextX, nextY, x, y, originX, originY) => {
      const side = (originX - x) * (nextY - y) - (originY - y) * (nextX - x);
      if (side >= 0) {
        return 0;
      } else {
        return 1;
      }
    };

    const calculateOrbitAngles = (skillsPerOrbit) => {
      const orbitAngles = [];
      skillsPerOrbit.forEach((skillsInOrbit, orbit) => {
        if (skillsInOrbit === 16) {
          // Every 30 and 45 degrees, per https://github.com/grindinggear/skilltree-export/blob/3.17.0/README.md
          orbitAngles[orbit] = [
            0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315,
            330,
          ];
        } else if (skillsInOrbit === 40) {
          // Every 10 and 45 degrees
          orbitAngles[orbit] = [
            0, 10, 20, 30, 40, 45, 50, 60, 70, 80, 90, 100, 110, 120, 130, 135,
            140, 150, 160, 170, 180, 190, 200, 210, 220, 225, 230, 240, 250,
            260, 270, 280, 290, 300, 310, 315, 320, 330, 340, 350,
          ];
        } else {
          // Uniformly spaced
          orbitAngles[orbit] = [];
          for (let i = 0; i < skillsInOrbit; i++) {
            orbitAngles[orbit][i + 1] = (360 * i) / skillsInOrbit;
          }
        }
        orbitAngles[orbit].forEach((degrees, i) => {
          orbitAngles[orbit][i] = (degrees * Math.PI) / 180;
        });
      });
      return orbitAngles;
    };

    const scale = 0.05;

    const htmlBegin = `<svg width="${scale * 18000}" height="${
      scale * 18000
    }">`;
    const htmlEnd = '</svg>';

    let svg = '';

    const nodes = Object.entries(passiveTree.nodes as object)
      .map((o) => o[1])
      .filter((o) => !!o.skill);

    const nodesCoordinates = [];

    const orbitAngle = calculateOrbitAngles(
      passiveTree.constants.skillsPerOrbit
    );

    Object.entries(passiveTree.groups)
      .map((o) => ({
        id: o[0],
        ...o[1],
      }))
      .forEach((group) => {
        const nodesByGroup = nodes.filter(
          (n) =>
            n.group === parseInt(group.id, 10) &&
            !n.ascendancyName &&
            !n.isProxy
        );

        if (nodesByGroup.length) {
          const cx = (group.x + 9000) * scale;
          const cy = (group.y + 9000) * scale;
          const maxOrbit = Math.max(...nodesByGroup.map((n) => n.orbit));
          const r = maxOrbit * 100 * scale;
          nodesByGroup.forEach((node) => {
            // const maxPerimeter = orbitMap(node.orbit);
            const orbitRatio = maxOrbit === 0 ? 0 : node.orbit / maxOrbit;
            const nodeDegrees =
              node.orbit && node.orbitIndex
                ? orbitAngle[node.orbit][node.orbitIndex]
                : 0;
            // const index = node.orbitIndex;
            // const nodeDegrees = (index / maxPerimeter) * 2 * Math.PI;
            if (
              !node.expansionJewel ||
              (node.name !== 'Medium Jewel Socket' &&
                node.name !== 'Small Jewel Socket')
            ) {
              nodesCoordinates.push({
                skill: node.skill,
                x:
                  Math.round(
                    (cx + Math.sin(nodeDegrees) * r * orbitRatio) * 100
                  ) / 100,
                y:
                  Math.round(
                    (cy - Math.cos(nodeDegrees) * r * orbitRatio) * 100
                  ) / 100,
                in: node.in.map((s) => parseInt(s, 10)),
                out: node.out.map((s) => parseInt(s, 10)),
                controlPoint: {
                  x: Math.round(cx * 100) / 100,
                  y: Math.round(cy * 100) / 100,
                },
                orbit: node.orbit,
                isMastery: !!node.isMastery,
              });
            }
          });
        }
      });

    nodesCoordinates.forEach((node) => {
      const fillColor = (nde) => {
        if (!allocatedPoints.includes(nde.skill)) {
          return 'rgba(0,0,0,0.3)';
        }

        if (!nde.isMastery) {
          return 'rgba(253, 185, 80)';
        }
        masteryColorIndex++;

        this.masteryData.push({
          color: masteryColors[masteryColorIndex - 1],
          masteryData: this.getMasteryDataFromTree(
            nde.skill,
            masteries.find((m) => m[0] === nde.skill)[1]
          ),
        });

        return masteryColors[masteryColorIndex - 1];
      };

      const border =
        node.isMastery && allocatedPoints.includes(node.skill)
          ? 'stroke="white" stroke-width="1"'
          : '';

      svg += `<circle cx="${node.x}" cy="${node.y}" r="${
        allocatedPoints.includes(node.skill) ? 2.5 : 1.5
      }" fill="${fillColor(node)}" data-skill="${node.skill}" ${border} />`;

      node.out.forEach((id: string) => {
        const outNode = nodesCoordinates.find(
          (nodeCoord) => parseInt(nodeCoord.skill, 10) === parseInt(id, 10)
        );

        if (outNode) {
          let pathD = '';

          if (
            outNode.controlPoint.x === node.controlPoint.x &&
            outNode.controlPoint.y === node.controlPoint.y
          ) {
            const radius = Math.sqrt(
              (node.x - node.controlPoint.x) * (node.x - node.controlPoint.x) +
                (node.y - node.controlPoint.y) * (node.y - node.controlPoint.y)
            );

            const angleBetweenPoints = computeAngle(
              radius,
              node.x,
              node.y,
              outNode.x,
              outNode.y
            );

            if (angleBetweenPoints) {
              pathD = `M${node.x} ${
                node.y
              } A${radius} ${radius} 0 0 ${getCurveWay(
                outNode.x,
                outNode.y,
                node.x,
                node.y,
                node.controlPoint.x,
                node.controlPoint.y
              )} ${outNode.x} ${outNode.y}`;
            } else {
              pathD = `M${node.x} ${node.y} L${outNode.x} ${outNode.y}`;
            }
          } else {
            pathD = `M${node.x} ${node.y} L${outNode.x} ${outNode.y}`;
          }

          svg += `<path d="${pathD}" stroke="${
            allocatedPoints.includes(node.skill) &&
            allocatedPoints.includes(outNode.skill)
              ? 'rgba(253, 185, 80)'
              : 'rgba(0,0,0,0.3)'
          }" stroke-width="${
            allocatedPoints.includes(node.skill) &&
            allocatedPoints.includes(outNode.skill)
              ? 0.75
              : 0.5
          } " fill="none" data-origin="${node.controlPoint.x} ${
            node.controlPoint.y
          }"/>`;
        }
      });
    });

    this.tree = htmlBegin + svg + htmlEnd;
  }

  public resetTree(): void {
    this.tree = '';
    this.treeDisplayed = false;
    this.masteryData = [];
  }

  private toggleTree(): void {
    this.zone.run(() => {
      if (this.tree.length > 0) {
        if (!this.treeDisplayed) {
          this.dialog.open(PassiveModalComponent, {
            data: { tree: this.tree, mastery: this.masteryData },
          });
          this.treeDisplayed = true;
        } else {
          this.dialog.closeAll();
          this.treeDisplayed = false;
        }
      }
    });
  }
}
