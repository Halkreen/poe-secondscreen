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

  public setTree(allocatedPoints: number[]): void {
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
    const scale = 0.07;

    const htmlBegin = `<svg width="${scale * 15000}" height="${
      scale * 14000
    }">`;
    const htmlEnd = '</svg>';

    let svg = '';

    const orbitMap = (n: number) => {
      if (n === 0) {
        return 1;
      }
      if (n === 1) {
        return 6;
      }
      if (n === 2) {
        return 12;
      }
      if (n === 3) {
        return 12;
      }
      if (n === 4) {
        return 40;
      }
      return null;
    };

    const nodes = Object.entries(passiveTree.nodes as object)
      .map((o) => o[1])
      .filter((o) => !!o.skill);

    const nodesCoordinates = [];

    Object.entries(passiveTree.groups)
      .map((o) => ({
        id: o[0],
        ...o[1],
      }))
      .forEach((group) => {
        const nodesByGroup = nodes.filter(
          (n) =>
            parseInt(n.group, 10) === parseInt(group.id, 10) &&
            !n.ascendancyName &&
            !n.isProxy
        );

        if (nodesByGroup.length) {
          const cx = (group.x + 7000) * scale;
          const cy = (group.y + 7000) * scale;
          const maxOrbit = Math.max(...group.orbits);
          const r = maxOrbit * 100 * scale;
          nodesByGroup.forEach((node) => {
            const maxPerimeter = orbitMap(node.orbit);
            const orbitRatio = maxOrbit === 0 ? 0 : node.orbit / maxOrbit;
            const index = node.orbitIndex;
            const nodeDegrees = (index / maxPerimeter) * 2 * Math.PI;
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
              });
            }
          });
        }
      });

    nodesCoordinates.forEach((node) => {
      svg += `<circle cx="${node.x}" cy="${node.y}" r="${
        allocatedPoints.includes(node.skill) ? 3 : 2
      }" fill="${
        allocatedPoints.includes(node.skill)
          ? 'rgba(253, 185, 80)'
          : 'rgba(0,0,0,0.3)'
      }" data-skill="${node.skill}" />`;
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
  }

  private toggleTree(): void {
    this.zone.run(() => {
      if (this.tree.length > 0) {
        if (!this.treeDisplayed) {
          this.dialog.open(PassiveModalComponent, { data: this.tree });
          this.treeDisplayed = true;
        } else {
          this.dialog.closeAll();
          this.treeDisplayed = false;
        }
      }
    });
  }
}