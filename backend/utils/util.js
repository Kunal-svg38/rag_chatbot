export const chunkText = (text, maxSize = 600, minSize = 200) => {
  const paragraphs = text.split(/\n\s*\n/);
  const chunks = [];
  let current = '';

  for (const p of paragraphs) {
    if ((current + p).length <= maxSize) {
      current += (current ? '\n\n' : '') + p;
    } else {
      if (current.length >= minSize) {
        chunks.push(current.trim());
        current = p;
      } else {
        for (let i = 0; i < p.length; i += maxSize) {
          chunks.push(p.slice(i, i + maxSize).trim());
        }
        current = '';
      }
    }
  }

  if (current.length >= minSize) {
    chunks.push(current.trim());
  }

  return chunks;
};
