export function generateSlug(title: string, id: string) {
  const charMap: Record<string, string> = {
    'æ': 'ae',
    'ø': 'o',
    'å': 'aa',
    'Æ': 'ae',
    'Ø': 'o',
    'Å': 'aa',
  };
  
  const slug = title
    .toLowerCase()
    .replace(/[æøåÆØÅ]/g, match => charMap[match])
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
    
  return `${slug}-${id}`;
}

export function extractIdFromSlug(slugOrId: string) {
  // If the parameter contains a hyphen, the ID is the last part
  // However, it could just be an old ID without a slug
  // Firebase IDs are usually 20 chars of alphanumeric
  const parts = slugOrId.split('-');
  return parts[parts.length - 1];
}
