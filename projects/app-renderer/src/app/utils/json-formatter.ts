import { Gear } from '../types/gear';
import { Gem } from '../types/gem';
import { Link } from '../types/link';
import { Notable } from '../types/notable';
import { SocketColor } from '../types/socket-color.enum';
import { gemData } from './gems';
import { passives } from './passives';

function findSocketColor(socket: string): SocketColor {
  if (socket === 'R') {
    return SocketColor.RED;
  }

  if (socket === 'G') {
    return SocketColor.GREEN;
  }

  if (socket === 'B') {
    return SocketColor.BLUE;
  }

  return SocketColor.RED;
}

export function formatLinks(sockets: string[]): Link[] {
  const links: Link[] = [];
  if (!sockets) {
    return [];
  }

  sockets.forEach((socket) => {
    if (socket.length > 1) {
      for (let i = 0; i < socket.length; i++) {
        const socketItem = socket.charAt(i);
        links.push({
          socketColor: findSocketColor(socketItem),
          isLinked: i !== socket.length - 1,
        });
      }
    } else {
      links.push({
        socketColor: findSocketColor(socket),
        isLinked: false,
      });
    }
  });
  return links;
}

export function formatGems(gems: string[], previousGems: string[]): Gem[] {
  if (!gems) {
    return [];
  }

  if (!previousGems) {
    return gems.map((gem: string) => {
      return { gemName: gem, isNew: true, gemImage: findGemIcon(gem) };
    });
  }

  return gems.map((gem: string) => {
    return {
      gemName: gem,
      isNew: !previousGems.includes(gem),
      gemImage: findGemIcon(gem),
    };
  });
}

export function findGearPiece(gear: Gear[] | null, type: string): Gear {
  if (!gear) {
    return null;
  }
  return gear.find((gearPiece) => gearPiece.type === type);
}

export function findGemIcon(gemName: string): string {
  const permissiveGemName = gemName
    .toLowerCase()
    .replace(/ /g, '')
    .replace(/support/g, '')
    .replace(/Vaal /g, '')
    .replace(/vaal /g, '');
  return gemData.find(
    (gem) =>
      gem.name
        .toLowerCase()
        .replace(/ /g, '')
        .replace(/support/g, '')
        .replace(/Vaal /g, '')
        .replace(/vaal /g, '') === permissiveGemName
  )?.image;
}

export function findNotableData(notable: Notable): Notable {
  const permissiveNotableName = notable.name.toLowerCase().replace(/ /g, '');
  const dataAssociated = passives.notables.find(
    (passive) =>
      passive.name.toLowerCase().replace(/ /g, '') === permissiveNotableName
  );

  if (!dataAssociated) {
    return notable;
  }

  return {
    ...notable,
    imgLink: dataAssociated.imgLink,
    isKeystone: dataAssociated.isKeystone,
  };
}
