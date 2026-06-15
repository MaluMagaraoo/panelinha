const URL_BASE = 'https://www.themealdb.com/api/json/v1/1';

const LETRAS_INICIAIS = ['a', 'b', 'c', 'd', 'e', 'f'];

// Busca receitas pelo nome. Sem parâmetro, busca em múltiplas letras em paralelo.
export const buscarReceitasPorNome = async (nome = '') => {
  if (nome !== '') {
    const resposta = await fetch(`${URL_BASE}/search.php?s=${nome}`);
    const dados = await resposta.json();
    return dados.meals || [];
  }

  const resultados = await Promise.all(
    LETRAS_INICIAIS.map(letra =>
      fetch(`${URL_BASE}/search.php?s=${letra}`)
        .then(r => r.json())
        .then(d => d.meals || [])
        .catch(() => [])
    )
  );

  const vistas = new Set();
  return resultados.flat().filter(receita => {
    if (vistas.has(receita.idMeal)) return false;
    vistas.add(receita.idMeal);
    return true;
  });
};

// Busca receita pelo ID
export const buscarReceitaPorId = async (id) => {
  const resposta = await fetch(`${URL_BASE}/lookup.php?i=${id}`);
  const dados = await resposta.json();
  return dados.meals ? dados.meals[0] : null;
};

// Busca categorias disponíveis
export const buscarCategorias = async () => {
  const resposta = await fetch(`${URL_BASE}/categories.php`);
  const dados = await resposta.json();
  return dados.categories || [];
};