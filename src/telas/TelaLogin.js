import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView, Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { entrar } from '../servicos/autenticacao';
import LogoPanelinha from '../componentes/LogoPanelinha';

const C = {
  fundo: '#F5EDE0',
  card: '#FFFFFF',
  primaria: '#E05C2A',
  titulo: '#C94F20',
  subtitulo: '#7A8C5E',
  label: '#6B4F3A',
  borda: '#EDE0D4',
  placeholder: '#BCA99A',
  texto: '#3D2B1F',
};

export default function TelaLogin({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleEntrar = async () => {
    if (!email || !senha) return Alert.alert('Atenção', 'Preencha todos os campos');
    setCarregando(true);
    try {
      await entrar(email, senha);
    } catch {
      Alert.alert('Erro', 'E-mail ou senha inválidos');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={e.tela}
    >
      <ScrollView contentContainerStyle={e.scroll} keyboardShouldPersistTaps="handled">
        <View style={e.container}>

          <LogoPanelinha size={250} />

          <Text style={e.titulo}>Panelinha</Text>
          <Text style={e.subtitulo}>Sabor que aquece o coração</Text>

          <View style={e.card}>

            <Text style={e.label}>E-mail</Text>
            <TextInput
              style={e.campo}
              placeholder="seu@email.com"
              placeholderTextColor={C.placeholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={e.label}>Senha</Text>
            <View style={e.campoSenhaBox}>
              <TextInput
                style={e.campoSenha}
                placeholder="••••••••"
                placeholderTextColor={C.placeholder}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!mostrarSenha}
              />
              <TouchableOpacity onPress={() => setMostrarSenha(v => !v)} style={e.olho}>
                <Ionicons name={mostrarSenha ? 'eye' : 'eye-off'} size={20} color={C.placeholder} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={e.botao} onPress={handleEntrar} disabled={carregando}>
              <Text style={e.textoBotao}>{carregando ? 'Entrando...' : 'Entrar'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('TelaCadastro')}>
              <Text style={e.link}>
                Não tem conta?{' '}
                <Text style={e.linkDestaque}>Criar conta</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento')}>
              <Text style={[e.linkDestaque, e.linkCentro]}>Esqueci minha senha</Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const e = StyleSheet.create({
  tela: { flex: 1, backgroundColor: C.fundo },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingVertical: 40 },
  container: { alignItems: 'center', paddingHorizontal: 24 },

  logo: { marginBottom: 18 },
  titulo: {
    fontSize: 38,
    fontWeight: '700',
    fontStyle: 'italic',
    color: C.titulo,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    fontStyle: 'italic',
    color: C.subtitulo,
    marginBottom: 28,
  },

  card: {
    backgroundColor: C.card,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    shadowColor: '#6B4F3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },

  label: { fontSize: 13, fontWeight: '600', color: C.label, marginBottom: 6 },
  campo: {
    backgroundColor: '#FAFAF8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.borda,
    fontSize: 15,
    color: C.texto,
  },
  campoSenhaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAF8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.borda,
    marginBottom: 20,
  },
  campoSenha: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: C.texto,
  },
  olho: { paddingRight: 14 },

  botao: {
    backgroundColor: C.primaria,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 18,
  },
  textoBotao: { color: '#fff', fontWeight: '700', fontSize: 16 },

  link: { textAlign: 'center', color: '#9E8878', fontSize: 14, marginBottom: 10 },
  linkDestaque: { color: C.primaria, fontWeight: '600', fontSize: 14 },
  linkCentro: { textAlign: 'center', marginTop: 2 },
});
