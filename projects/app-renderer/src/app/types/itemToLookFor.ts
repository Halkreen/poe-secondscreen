import { SocketColor } from './socket-color.enum';

export interface ItemToLookFor {
  level: number;
  levelMax?: number;
  links: SocketColor[];
}
