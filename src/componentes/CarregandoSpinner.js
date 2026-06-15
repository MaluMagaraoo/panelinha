import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import LogoPanelinha from './LogoPanelinha';

export default function CarregandoSpinner({ mensagem = 'Carregando...' }) {
  return (
    <View style={e.container}>
      <LogoPanelinha size={72} />
      <ActivityIndicator size="large" color="#E05C2A" style={e.spinner} />
      <Text style={e.texto}>{mensagem}</Text>
    </View>
  );
}

const e = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5EDE0',
    gap: 16,
  },
  spinner: { marginTop: 4 },
  texto: { fontSize: 15, color: '#A08878', fontStyle: 'italic' },
});
