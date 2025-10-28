interface HeaderLinksProps {
  id: number
  name: string
  slug: string
  description: string
  prefetchFn?: () => void
}

export const headerLinks: HeaderLinksProps[] = [
    {
        id: 0,
        name: 'Home Page',
        slug: '/',
        description: 'View the home page of the Pokémon website.',
    },
    {
        id: 2,
        name: 'Pokémon',
        slug: '/pokemons',
        description: 'Browse and explore all Pokémon in the living dex.',
    },
  {
    id: 3,
    name: 'Abilities',
    slug: 'abilities',
    description: 'Discover the unique abilities that Pokémon can possess.',
  },
  {
    id: 4,
    name: 'Moves',
    slug: 'moves',
    description: 'Learn about all the moves your Pokémon can master.',
  },
  {
    id: 5,
    name: 'Items',
    slug: 'items',
    description: 'Find information about items used in Pokémon battles and gameplay.',
  },
  {
    id: 6,
    name: 'Types',
    slug: 'types',
    description: 'Understand type matchups and strengths in battle.',
  },
  {
    id: 7,
    name: 'Collection',
    slug: 'collection',
    description: 'View your Pokémon collection organized by generation.',
  },
  {
    id: 8,
    name: 'Strategy',
    slug: 'strategy',
    description: 'Develop effective strategies for competitive Pokémon battles.',
  },
  {
    id: 9,
    name: 'Cards',
    slug: 'cards',
    description: 'Explore the Pokémon cards collection.',
  },
  {
    id: 10,
    name: 'Berries',
    slug: 'berries',
    description: 'Discover all the berries available in the Pokémon games.',

  },
  {
    id: 11,
    name: 'Locations',
    slug: 'locations',
    description: 'Explore all the locations where Pokémon can be found.',
  },
  {
    id: 12,
    name: 'Sprites',
    slug: 'sprites',
    description: 'View sprites and artwork of all Pokémon.',
  },
  {
    id: 13,
    name: 'Miscellaneous',
    slug: 'miscellaneous',
    description: 'Explore various utilities and tools for Pokémon games.',
  },
]