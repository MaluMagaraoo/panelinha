import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { bancoDados } from '../../firebaseConfig';
import { adicionarFavorito, removerFavorito } from '../servicos/bancoDados';

export const useFavoritos = (idUsuario) => {
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (!idUsuario) return;

    setCarregando(true);

    const consulta = query(
      collection(bancoDados, 'favoritos'),
      where('idUsuario', '==', idUsuario)
    );

    // Escuta em tempo real — qualquer mudança no Firestore atualiza a tela automaticamente
    const cancelar = onSnapshot(
      consulta,
      (snapshot) => {
        const dados = snapshot.docs.map(doc => doc.data());
        setFavoritos(dados);
        setCarregando(false);
      },
      (erro) => {
        console.error('Erro ao carregar favoritos:', erro);
        setCarregando(false);
      }
    );

    return () => cancelar();
  }, [idUsuario]);

  const ehFavorito = (idReceita) => favoritos.some(f => f.idReceita === idReceita);

  const alternarFavorito = async (receita) => {
    if (!idUsuario) return;
    if (ehFavorito(receita.idMeal)) {
      await removerFavorito(idUsuario, receita.idMeal);
    } else {
      await adicionarFavorito(idUsuario, receita);
    }
    // Estado atualizado automaticamente pelo onSnapshot — sem manipulação manual
  };

  return { favoritos, carregando, ehFavorito, alternarFavorito };
};
