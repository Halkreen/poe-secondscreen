import { LevelingData } from './leveling-data';
import { Notable } from './notable';

export interface CharactersData {
  notables: Notable[];
  gearing: LevelingData[];
}
