import { bancoDados } from '../../firebaseConfig';
import {
  doc, setDoc, deleteDoc, getDocs,
  collection, query, where
} from 'firebase/firestore';

// Adiciona receita aos favoritos
export const adicionarFavorito = async (idUsuario, receita) => {
  const referencia = doc(bancoDados, 'favoritos', `${idUsuario}_${receita.idMeal}`);
  await setDoc(referencia, {
    idUsuario,
    idReceita: receita.idMeal,
    nomeReceita: receita.strMeal,
    imagemReceita: receita.strMealThumb,
    categoriaReceita: receita.strCategory,
    criadoEm: new Date()
  });
};

// Remove receita dos favoritos
export const removerFavorito = async (idUsuario, idReceita) => {
  const referencia = doc(bancoDados, 'favoritos', `${idUsuario}_${idReceita}`);
  await deleteDoc(referencia);
};

// Busca todos os favoritos do usuário
export const buscarFavoritos = async (idUsuario) => {
  const consulta = query(
    collection(bancoDados, 'favoritos'),
    where('idUsuario', '==', idUsuario)
  );
  const resultado = await getDocs(consulta);
  return resultado.docs.map(doc => doc.data());
};