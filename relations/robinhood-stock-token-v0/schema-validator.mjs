// Small validator for the JSON Schema subset used by this profile. No coercion.
// Not a general-purpose JSON Schema implementation; unsupported keywords throw.
const keywords = new Set(['$schema', '$id', '$defs', '$ref', 'title', 'description',
  'type', 'const', 'enum', 'required', 'properties', 'additionalProperties',
  'pattern', 'minLength', 'maxLength', 'minimum', 'maximum', 'items', 'anyOf']);
export function validate(value, schema, root = schema, path = '$') {
  const errors = [];
  for (const key of Object.keys(schema)) {
    if (!keywords.has(key)) throw new Error(`Unsupported schema keyword: ${key}`);
  }
  if (schema.$ref) {
    if (!schema.$ref.startsWith('#/$defs/')) throw new Error('Only local definition refs supported');
    return validate(value, root.$defs[schema.$ref.slice(8)], root, path);
  }
  if (schema.anyOf && !schema.anyOf.some(s => validate(value, s, root, path).length === 0)) {
    errors.push(`${path}: no supported alternative`);
  }
  const types = Array.isArray(schema.type) ? schema.type : [schema.type];
  const matches = t => t === undefined || (t === 'null' ? value === null
    : t === 'object' ? value !== null && typeof value === 'object' && !Array.isArray(value)
    : t === 'array' ? Array.isArray(value)
    : t === 'integer' ? Number.isSafeInteger(value) : typeof value === t);
  if (!types.some(matches)) return [...errors, `${path}: invalid type`];
  if ('const' in schema && value !== schema.const) errors.push(`${path}: const mismatch`);
  if (schema.enum && !schema.enum.includes(value)) errors.push(`${path}: enum mismatch`);
  if (typeof value === 'string') {
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) errors.push(`${path}: pattern mismatch`);
    if (value.length < (schema.minLength ?? 0) || value.length > (schema.maxLength ?? Infinity)) errors.push(`${path}: length`);
  }
  if (typeof value === 'number' && (value < (schema.minimum ?? -Infinity) || value > (schema.maximum ?? Infinity))) errors.push(`${path}: range`);
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    for (const key of schema.required ?? []) if (!Object.hasOwn(value, key)) errors.push(`${path}.${key}: required`);
    for (const [key, item] of Object.entries(value)) {
      if (schema.properties?.[key]) errors.push(...validate(item, schema.properties[key], root, `${path}.${key}`));
      else if (schema.additionalProperties === false) errors.push(`${path}.${key}: unknown property`);
    }
  }
  if (Array.isArray(value) && schema.items) value.forEach((v, i) => errors.push(...validate(v, schema.items, root, `${path}[${i}]`)));
  return errors;
}
