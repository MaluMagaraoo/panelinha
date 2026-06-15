import { useState, useEffect } from 'react';
import { buscarReceitasPorNome } from '../servicos/api';

// Hook customizado para buscar receitas
export const useReceitas = (termoBusca = '') => {
  const [receitas, setReceitas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        setCarregando(true);
        const resultado = await buscarReceitasPorNome(termoBusca);
        setReceitas(resultado);
      } catch (e) {
        setErro(e.message);
      } finally {
        setCarregando(false);
      }
    };
    buscarDados();
  }, [termoBusca]);

  return { receitas, carregando, erro };
};