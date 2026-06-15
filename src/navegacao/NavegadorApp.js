import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { autenticacao } from '../../firebaseConfig';
import TelaLogin from '../telas/TelaLogin';
import TelaCadastro from '../telas/TelaCadastro';
import NavegadorGaveta from './NavegadorGaveta';
import CarregandoSpinner from '../componentes/CarregandoSpinner';

const Pilha = createStackNavigator();

export default function NavegadorApp() {
  const [usuario, setUsuario] = useState(undefined);

  // Observa mudanças no estado de autenticação
  useEffect(() => {
    const cancelarObservador = onAuthStateChanged(autenticacao, u => setUsuario(u ?? null));
    return cancelarObservador;
  }, []);

  if (usuario === undefined) return <CarregandoSpinner mensagem="Iniciando o Panelinha..." />;

  return (
    <NavigationContainer>
      <Pilha.Navigator screenOptions={{ headerShown: false }}>
        {usuario ? (
          <Pilha.Screen name="App" component={NavegadorGaveta} />
        ) : (
          <>
            <Pilha.Screen name="TelaLogin" component={TelaLogin} />
            <Pilha.Screen name="TelaCadastro" component={TelaCadastro} />
          </>
        )}
      </Pilha.Navigator>
    </NavigationContainer>
  );
}