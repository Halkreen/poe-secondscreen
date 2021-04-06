import { Gem } from '../types/gem';
import { Link } from '../types/link';
import { SocketColor } from '../types/socket-color.enum';

export function formatLinks(sockets: SocketColor[]): Link[] {
  const links: Link[] = [];
  sockets.forEach((socket, index) => {
    links.push({
      socketColor: socket,
      isLinked: index !== sockets.length - 1,
    });
  });
  return links;
}

export function formatGems(gems: string[]): Gem[] {
  return gems.map((gem, index) => {
    return { gemName: gem, isNew: index === gems.length - 1 };
  });
}
