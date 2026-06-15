import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView, Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cadastrar } from '../servicos/autenticacao';
import LogoPanelinha from '../componentes/LogoPanelinha';

const C = {
  fundo: '#F5EDE0',
  card: '#FFFFFF',
  primaria: '#E05C2A',
  titulo: '#C94F20',
  subtitulo: '#7A8C5E',
  label: '#E05C2A',
  borda: '#EDE0D4',
  placeholder: '#BCA99A',
  texto: '#3D2B1F',
};

const AVATARES = [
  { id: 'cozinheira', emoji: '👩‍🍳', nome: 'Cozinheira' },
  { id: 'cozinheiro', emoji: '👨‍🍳', nome: 'Cozinheiro' },
  { id: 'neutro',     emoji: '🧑‍🍳', nome: 'Neutro' },
];

export default function TelaCadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [avatar, setAvatar] = useState('cozinheira');

  const handleCadastrar = async () => {
    if (!nome || !email || !senha) return Alert.alert('Atenção', 'Preencha todos os campos');
    if (senha.length < 8) return Alert.alert('Atenção', 'Senha deve ter pelo menos 8 caracteres');
    setCarregando(true);
    try {
      await cadastrar(email, senha, nome, avatar);
    } catch (err) {
      Alert.alert('Erro', err.message);
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
          <Text style={e.subtitulo}>Crie sua conta gratuita</Text>

          <View style={e.card}>

            <Text style={e.secaoTitulo}>Escolha seu avatar</Text>
            <View style={e.avatares}>
              {AVATARES.map(av => (
                <TouchableOpacity
                  key={av.id}
                  style={[e.avatarItem, avatar === av.id && e.avatarAtivo]}
                  onPress={() => setAvatar(av.id)}
                >
                  <Text style={e.avatarEmoji}>{av.emoji}</Text>
                  <Text style={[e.avatarNome, avatar === av.id && e.avatarNomeAtivo]}>
                    {av.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={e.label}>Nome completo</Text>
            <TextInput
              style={e.campo}
              placeholder="Seu nome"
              placeholderTextColor={C.placeholder}
              value={nome}
              onChangeText={setNome}
            />

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
                placeholder="Mínimo 8 caracteres"
                placeholderTextColor={C.placeholder}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!mostrarSenha}
              />
              <TouchableOpacity onPress={() => setMostrarSenha(v => !v)} style={e.olho}>
                <Ionicons name={mostrarSenha ? 'eye' : 'eye-off'} size={20} color={C.placeholder} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={e.botao} onPress={handleCadastrar} disabled={carregando}>
              <Text style={e.textoBotao}>{carregando ? 'Cadastrando...' : 'Cadastrar'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={e.link}>
                Já tem conta?{' '}
                <Text style={e.linkDestaque}>Entrar</Text>
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const e = StyleSheet.create({
  tela: { flex: 1, backgroundColor: C.fundo },
  scroll: { flexGrow: 1, justifyContent: 'center', paddingVertical: 20 },
  container: { alignItems: 'center', paddingHorizontal: 24 },

  titulo: {
    fontSize: 32,
    fontWeight: '700',
    fontStyle: 'italic',
    color: C.titulo,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginTop: -12,
    marginBottom: 2,
  },
  subtitulo: {
    fontSize: 13,
    fontStyle: 'italic',
    color: C.subtitulo,
    marginBottom: 16,
    textAlign: 'center',
  },

  card: {
    backgroundColor: C.card,
    borderRadius: 24,
    padding: 20,
    width: '100%',
    shadowColor: '#6B4F3A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },

  secaoTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: C.texto,
    textAlign: 'center',
    marginBottom: 10,
  },
  avatares: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
  },
  avatarItem: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: C.fundo,
    width: 82,
  },
  avatarAtivo: {
    borderColor: C.primaria,
  },
  avatarEmoji: { fontSize: 30, marginBottom: 2 },
  avatarNome: { fontSize: 12, color: C.placeholder, fontWeight: '500' },
  avatarNomeAtivo: { color: C.primaria, fontWeight: '700' },

  label: { fontSize: 13, fontWeight: '600', color: C.label, marginBottom: 6 },
  campo: {
    backgroundColor: C.fundo,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 15,
    color: C.texto,
  },
  campoSenhaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.fundo,
    borderRadius: 12,
    marginBottom: 16,
  },
  campoSenha: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
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

  link: { textAlign: 'center', color: '#9E8878', fontSize: 14 },
  linkDestaque: { color: C.primaria, fontWeight: '600', fontSize: 14 },
});
