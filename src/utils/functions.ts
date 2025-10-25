export const extractPokemonIdFromUrl = (url: string): number | null => {
  const match = url.match(/\/(\d+)\/?$/)
  return match ? parseInt(match[1], 10) : null
}
