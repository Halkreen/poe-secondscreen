import { SocketColorEnum } from './socket-color.enum';

export interface Gear {
  type: string;
  linkNumbers: number;
  sockets: SocketColorEnum[];
  gems: string[];
}
