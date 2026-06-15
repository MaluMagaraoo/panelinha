import { autenticacao } from '../../firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';

// Cadastra novo usuário
export const cadastrar = async (email, senha, nome, avatar = 'cozinheira') => {
  const credencial = await createUserWithEmailAndPassword(autenticacao, email, senha);
  await updateProfile(credencial.user, { displayName: nome, photoURL: avatar });
  return credencial.user;
};

// Faz login do usuário
export const entrar = async (email, senha) => {
  const credencial = await signInWithEmailAndPassword(autenticacao, email, senha);
  return credencial.user;
};

// Faz logout do usuário
export const sair = async () => {
  await signOut(autenticacao);
};