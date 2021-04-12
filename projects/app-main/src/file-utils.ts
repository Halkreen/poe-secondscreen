export function findLastAction(
  characterName: string,
  filePath: string
): { newLevel: number } | { newPassive: number } {
  const levels = [
    ...filePath.matchAll(/\w+ \(\w+\) is now level \d{1,3}/g),
  ].map((m) => (m[0] ? m[0] : null));

  if (levels && levels.length && levels[0] !== null) {
    const splitted = levels[levels.length - 1].split(' ');
    const charName = splitted[0];
    const level = splitted[splitted.length - 1];
    console.log(`Level up ! ${charName} is now level ${level}`);
    if (charName === characterName) {
      return { newLevel: parseInt(level, 10) };
    }
  }

  const passives = [...filePath.matchAll(/Passive Skill Point/g)].map((m) =>
    m[0] ? m[0] : null
  );

  if (passives && passives.length && passives[0] !== null) {
    console.log('Added passive !');
    return { newPassive: 1 };
  }

  return null;
}
