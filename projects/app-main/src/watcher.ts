import { findLastAction } from './file-utils';

const Tail = require('./tail');

export class Watcher {
  public watcher = null;

  public startWatcher(
    filePath: string,
    characterName: string,
    newPassivePointsCallback: (characterName: string, path: number) => void,
    nextLevelCallback: (characterName: string, path: number) => void
  ): void {
    const watcher = new Tail(filePath, '\r\n');
    console.log('Watcher loaded for: ' + characterName);

    function onChange(line: string): void {
      const nextAction = findLastAction(characterName, line);
      if ((nextAction as any)?.newLevel) {
        nextLevelCallback(characterName, (nextAction as any)?.newLevel);
        return;
      }

      if ((nextAction as any)?.newPassive) {
        newPassivePointsCallback(
          characterName,
          (nextAction as any)?.newPassive
        );
        return;
      }
    }

    watcher.on('line', onChange);
    watcher.on('error', (data) => {
      console.log('error:' + data);
    });

    watcher.watch();
    this.watcher = watcher;
  }

  public stopWatcher(): void {
    this.watcher.unwatch();
  }
}
