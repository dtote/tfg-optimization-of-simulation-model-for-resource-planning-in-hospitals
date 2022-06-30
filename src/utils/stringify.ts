export const stringify = (obj: any, indent = 2) =>
  JSON.stringify(
    obj,
    (_, value) => {
      if (Array.isArray(value) && !value.some(x => x && typeof x === 'object')) {
        return `\uE000${JSON.stringify(value.map(v => (typeof v === 'string' ? v.replace(/"/g, '\uE001') : v)))}\uE000`;
      }
      return value;
    },
    indent,
  ).replace(/"\uE000([^\uE000]+)\uE000"/g, match =>
    match
      .slice(2, match.length - 2)
      .replace(/\\"/g, '"')
      .replace(/\uE001/g, '\\"'),
  );
