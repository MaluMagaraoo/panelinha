const cache = {};

async function traduzirChunk(texto) {
  if (cache[texto]) return cache[texto];
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=en|pt-BR`;
    const res = await fetch(url);
    const data = await res.json();
    const resultado = data.responseData?.translatedText || texto;
    cache[texto] = resultado;
    return resultado;
  } catch {
    return texto;
  }
}

// Traduz textos longos dividindo por parágrafo
export async function traduzirTexto(texto) {
  if (!texto) return '';
  const paragrafos = texto.split(/\r?\n/).filter(p => p.trim());
  const traduzidos = await Promise.all(
    paragrafos.map(p => p.length > 450 ? traduzirChunk(p.slice(0, 450)) : traduzirChunk(p))
  );
  return traduzidos.join('\n\n');
}

// Traduz lista de ingredientes de uma vez (mais eficiente)
export async function traduzirIngredientes(lista) {
  if (!lista.length) return lista;
  const texto = lista.join('\n');
  if (texto.length > 450) {
    // Traduz cada um individualmente se a lista for grande
    return Promise.all(lista.map(ing => traduzirChunk(ing)));
  }
  const traduzido = await traduzirChunk(texto);
  return traduzido.split('\n');
}
