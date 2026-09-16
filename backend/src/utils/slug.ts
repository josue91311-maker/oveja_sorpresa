export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9\s-]/g, '')    // remove non-alphanumeric
    .replace(/[\s_-]+/g, '-')       // replace spaces and underscores with -
    .replace(/^-+|-+$/g, '');       // trim - from ends
}
