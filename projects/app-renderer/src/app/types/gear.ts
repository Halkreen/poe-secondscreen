import { SocketColorEnum } from './socket-color.enum';

export interface Gear {
  type: string;
  sockets: SocketColorEnum[];
  gems: string[];
}
