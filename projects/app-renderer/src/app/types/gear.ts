import { SocketColor } from './socket-color.enum';

export interface Gear {
  type: string;
  sockets: SocketColor[];
  gems: string[];
}
