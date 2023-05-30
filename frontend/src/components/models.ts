export enum Level {
    Junior = 'J',
    Medior = 'M',
    Senior = 'S',
    Expert = 'E'
}

export const LevelFormatter = (value: Level) => {
    switch (value) {
      case Level.Junior:
        return 'Junior'
      case Level.Medior:
        return 'Medior'
      case Level.Senior:
        return 'Senior'
      case Level.Expert:
        return 'Expert'
    }
  }