interface generationsProps {
  generation: string
  title: string
  slug: string
  subtitle: string
  classes: string
  pokedexLength: string
  pokedexRange: string[]
}

export const generations: generationsProps[] = [
  {
    generation: '(0)',
    title: 'ALL REGIONS',
    slug: 'all-regions',
    subtitle:
      'Postremo ad id indignitatis est ventum, ut cum peregrini ob formidatam haut ita dudum alimentorum inopiam pellerentur ab urbe praecipites, sectatoribus disciplinarum liberalium inpendio paucis',
    classes: '',
    pokedexLength: '1025',
    pokedexRange: ['0', '1025'],
  },
  {
    generation: '(01)',
    title: 'Kanto',
    slug: 'kanto',
    subtitle:
      'The original region where it all began. Home to 151 Pokémon and the legendary adventures of Red and Blue.',
    classes: '',
    pokedexLength: '151',
    pokedexRange: ['0', '151'],
  },
  {
    generation: '(02)',
    title: 'Johto',
    slug: 'johto',
    subtitle:
      'A region rich in tradition and history, introducing 100 new Pokémon and the day/night cycle.',
    classes: '',
    pokedexLength: '100',
    pokedexRange: ['151', '251'],
  },
  {
    generation: '(03)',
    title: 'Hoenn',
    slug: 'hoenn',
    subtitle:
      'A tropical paradise with diverse ecosystems, bringing 135 new Pokémon and double battles.',
    classes: '',
    pokedexLength: '135',
    pokedexRange: ['251', '386'],
  },
  {
    generation: '(04)',
    title: 'Sinnoh',
    slug: 'sinnoh',
    subtitle:
      'A region of myth and legend, introducing 107 new Pokémon and the physical/special split.',
    classes: '',
    pokedexLength: '107',
    pokedexRange: ['386', '493'],
  },
  {
    generation: '(05)',
    title: 'Unova',
    slug: 'unova',
    subtitle:
      'A modern metropolis inspired by New York, featuring 156 new Pokémon and seasonal changes.',
    classes: '',
    pokedexLength: '156',
    pokedexRange: ['493', '649'],
  },
  {
    generation: '(06)',
    title: 'Kalos',
    slug: 'kalos',
    subtitle:
      'A region of elegance and beauty, introducing 72 new Pokémon and Mega Evolution.',
    classes: '',
    pokedexLength: '72',
    pokedexRange: ['649', '721'],
  },
  {
    generation: '(07)',
    title: 'Alola',
    slug: 'alola',
    subtitle:
      'A tropical archipelago with island culture, bringing 81 new Pokémon and regional variants.',
    classes: '',
    pokedexLength: '88',
    pokedexRange: ['721', '809'],
  },
  {
    generation: '(08)',
    title: 'Galar',
    slug: 'galar',
    subtitle:
      'An industrial powerhouse with countryside charm, featuring 81 new Pokémon and Dynamax battles.',
    classes: '',
    pokedexLength: '96',
    pokedexRange: ['809', '905'],
  },
  {
    generation: '(09)',
    title: 'Paldea',
    slug: '/paldea',
    subtitle:
      'An open-world adventure across diverse landscapes, introducing 103 new Pokémon and Terastallization.',
    classes: '',
    pokedexLength: '120',
    pokedexRange: ['905', '1025'],
  },
]
