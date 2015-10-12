export default function buildDefaultValueForType(type) {
  switch (type) {
  case 'object': return Object.create(null);
  case 'array': return [];
  default:
    return undefined;
  }
}
