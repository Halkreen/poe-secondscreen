import { Gear } from '../types/gear';
import { Gem } from '../types/gem';
import { Link } from '../types/link';
import { SocketColor } from '../types/socket-color.enum';

export function formatLinks(sockets: SocketColor[]): Link[] {
  const links: Link[] = [];
  if (!sockets) {
    return [];
  }
  sockets.forEach((socket, index) => {
    links.push({
      socketColor: socket,
      isLinked: index !== sockets.length - 1,
    });
  });
  return links;
}

export function formatGems(gems: string[], previousGems: string[]): Gem[] {
  if (!gems) {
    return [];
  }

  if (!previousGems) {
    return gems.map((gem: string) => {
      return { gemName: gem, isNew: false };
    });
  }

  return gems.map((gem: string) => {
    return { gemName: gem, isNew: !previousGems.includes(gem) };
  });
}

export function findGearPiece(gear: Gear[] | null, type: string): Gear {
  if (!gear) {
    return null;
  }
  return gear.find((gearPiece) => gearPiece.type === type);
}
