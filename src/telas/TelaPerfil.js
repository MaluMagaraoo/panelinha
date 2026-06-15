import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Image, Modal, TextInput, Alert, useWindowDimensions, Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { updateProfile } from 'firebase/auth';
import { autenticacao } from '../../firebaseConfig';
import { useFavoritos } from '../hooks/useFavoritos';

const C = {
  fundo: '#F5EDE0',
  card: '#FFFFFF',
  primaria: '#E05C2A',
  titulo: '#1A1A1A',
  texto: '#3D2B1F',
  sub: '#8C8C8C',
  estrela: '#F5A623',
};

function getRating(id) {
  return (4.5 + (parseInt((id || '0').slice(-1)) % 6) * 0.08).toFixed(1);
}

function getTempo(id) {
  const t = ['20 min', '30 min', '45 min', '1h', '1h 20min', '25 min', '50 min', '35 min'];
  return t[parseInt((id || '0').slice(-2)) % t.length];
}

function Estrelas({ nota }) {
  const arredondado = Math.round(parseFloat(nota));
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <Ionicons key={s} name={s <= arredondado ? 'star' : 'star-outline'} size={13} color={C.estrela} />
      ))}
    </View>
  );
}

function CardAvaliacao({ item, aoClicar }) {
  const rating = getRating(item.idReceita);
  const tempo = getTempo(item.idReceita);
  return (
    <TouchableOpacity style={a.card} onPress={aoClicar} activeOpacity={0.88}>
      <Image source={{ uri: item.imagemReceita }} style={a.imagem} />
      <View style={a.info}>
        <View style={a.linhaTop}>
          <Text style={a.nome} numberOfLines={2}>{item.nomeReceita}</Text>
          <View style={a.tempo}>
            <Ionicons name="time-outline" size={12} color={C.sub} />
            <Text style={a.tempoTexto}> {tempo}</Text>
          </View>
        </View>
        <Text style={a.chef}>Chef {item.categoriaReceita || 'Panelinha'}</Text>
        <Estrelas nota={rating} />
      </View>
    </TouchableOpacity>
  );
}

export default function TelaPerfil({ navigation }) {
  const { height } = useWindowDimensions();
  const usuario = autenticacao.currentUser;
  const { favoritos } = useFavoritos(usuario?.uid);

  const [modalVisivel, setModalVisivel] = useState(false);
  const [novoNome, setNovoNome] = useState(usuario?.displayName || '');

  const AVATAR_EMOJI = { cozinheira: '👩‍🍳', cozinheiro: '👨‍🍳', neutro: '🧑‍🍳' };
  const avatarEmoji = AVATAR_EMOJI[usuario?.photoURL] || null;

  const iniciais = usuario?.displayName
    ? usuario.displayName.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : '?';

  const semanasAtivo = usuario?.metadata?.creationTime
    ? Math.max(1, Math.floor((Date.now() - new Date(usuario.metadata.creationTime).getTime()) / (1000 * 60 * 60 * 24 * 7)))
    : 1;

  const salvarPerfil = async () => {
    if (!novoNome.trim()) return Alert.alert('Atenção', 'O nome não pode estar vazio.');
    try {
      await updateProfile(usuario, { displayName: novoNome.trim() });
      setModalVisivel(false);
      Alert.alert('Sucesso', 'Perfil atualizado!');
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    }
  };

  return (
    <View style={{ height, backgroundColor: C.fundo }}>
      {/* Header */}
      <View style={e.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="menu" size={26} color={C.titulo} />
        </TouchableOpacity>
        <Text style={e.headerTitulo}>Perfil</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Avatar + info */}
        <View style={e.perfilBox}>
          <View style={e.avatarRing}>
            <View style={e.avatar}>
              <Text style={avatarEmoji ? e.avatarEmoji : e.avatarTexto}>
                {avatarEmoji || iniciais}
              </Text>
            </View>
          </View>

          <Text style={e.nome}>{usuario?.displayName || 'Usuário'}</Text>
          <Text style={e.email}>{usuario?.email}</Text>
          <Text style={e.bio}>Apaixonada por culinária brasileira e receitas da vovó 🍲</Text>

          <TouchableOpacity style={e.btnEditar} onPress={() => setModalVisivel(true)} activeOpacity={0.85}>
            <Ionicons name="pencil" size={15} color="#fff" />
            <Text style={e.btnEditarTexto}>Editar perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={e.statsRow}>
          <View style={e.statCard}>
            <Ionicons name="star" size={22} color={C.estrela} />
            <Text style={e.statNum}>{favoritos.length}</Text>
            <Text style={e.statLabel}>Avaliações</Text>
          </View>
          <View style={e.statCard}>
            <Ionicons name="heart" size={22} color={C.primaria} />
            <Text style={e.statNum}>{favoritos.length}</Text>
            <Text style={e.statLabel}>Favoritos</Text>
          </View>
          <View style={e.statCard}>
            <Ionicons name="calendar-outline" size={22} color="#7A8C5E" />
            <Text style={e.statNum}>{semanasAtivo}</Text>
            <Text style={e.statLabel}>Semanas Ativo</Text>
          </View>
        </View>

        {/* Minhas Avaliações */}
        <Text style={e.secaoTitulo}>Minhas Avaliações</Text>
        {favoritos.length === 0 ? (
          <Text style={e.vazio}>Favorite receitas para elas aparecerem aqui</Text>
        ) : (
          favoritos.map(item => (
            <CardAvaliacao
              key={item.idReceita}
              item={item}
              aoClicar={() => navigation.navigate('Início', {
                screen: 'TelaDetalhes',
                params: { idReceita: item.idReceita },
              })}
            />
          ))
        )}
      </ScrollView>

      {/* Modal editar perfil */}
      <Modal visible={modalVisivel} transparent animationType="fade">
        <View style={m.overlay}>
          <View style={m.modal}>
            <Text style={m.titulo}>Editar perfil</Text>
            <Text style={m.label}>Nome</Text>
            <TextInput
              style={m.input}
              value={novoNome}
              onChangeText={setNovoNome}
              placeholder="Seu nome"
              placeholderTextColor="#BCA99A"
              autoFocus
            />
            <View style={m.botoes}>
              <TouchableOpacity style={m.btnCancelar} onPress={() => setModalVisivel(false)}>
                <Text style={m.btnCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={m.btnSalvar} onPress={salvarPerfil}>
                <Text style={m.btnSalvarTexto}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const e = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 8,
  },
  headerTitulo: {
    fontSize: 20,
    fontWeight: '700',
    fontStyle: 'italic',
    color: C.titulo,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },

  perfilBox: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  avatarRing: {
    width: 96, height: 96, borderRadius: 48,
    borderWidth: 3, borderColor: C.primaria,
    padding: 4, marginBottom: 14,
  },
  avatar: {
    flex: 1, borderRadius: 44,
    backgroundColor: '#FDF0E8',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarTexto: { fontSize: 28, fontWeight: '700', color: C.primaria },
  avatarEmoji: { fontSize: 42 },
  nome: { fontSize: 22, fontWeight: '700', color: C.titulo, marginBottom: 4 },
  email: { fontSize: 13, color: C.sub, marginBottom: 8 },
  bio: { fontSize: 13, color: C.sub, textAlign: 'center', lineHeight: 20, marginBottom: 16, paddingHorizontal: 16 },
  btnEditar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: C.primaria,
    paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: 24,
  },
  btnEditarTexto: { color: '#fff', fontWeight: '700', fontSize: 14 },

  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 24,
    gap: 10,
  },
  statCard: {
    flex: 1, alignItems: 'center', gap: 4,
    backgroundColor: C.card,
    borderRadius: 16, paddingVertical: 16,
    shadowColor: '#6B4F3A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
  },
  statNum: { fontSize: 20, fontWeight: '700', color: C.titulo },
  statLabel: { fontSize: 11, color: C.sub },

  secaoTitulo: {
    fontSize: 20, fontWeight: '700', color: C.titulo,
    marginHorizontal: 16, marginBottom: 12,
  },
  vazio: { textAlign: 'center', color: C.sub, marginTop: 16, fontSize: 14 },
});

const a = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    shadowColor: '#6B4F3A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
  },
  imagem: { width: 70, height: 70, borderRadius: 12 },
  info: { flex: 1, marginLeft: 12 },
  linhaTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  nome: { fontSize: 14, fontWeight: '700', color: C.texto, flex: 1, lineHeight: 20, marginBottom: 3, marginRight: 8 },
  tempo: { flexDirection: 'row', alignItems: 'center' },
  tempoTexto: { fontSize: 12, color: C.sub },
  chef: { fontSize: 12, color: C.sub, marginBottom: 6 },
});

const m = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  modal: {
    backgroundColor: '#fff', borderRadius: 20,
    padding: 24, width: '100%',
  },
  titulo: { fontSize: 18, fontWeight: '700', color: C.titulo, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#6B4F3A', marginBottom: 6 },
  input: {
    backgroundColor: '#F5EDE0', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    fontSize: 15, color: C.texto, marginBottom: 20,
  },
  botoes: { flexDirection: 'row', gap: 10 },
  btnCancelar: {
    flex: 1, paddingVertical: 12, borderRadius: 12,
    borderWidth: 1, borderColor: '#EDE0D4', alignItems: 'center',
  },
  btnCancelarTexto: { color: C.sub, fontWeight: '600' },
  btnSalvar: {
    flex: 1, paddingVertical: 12, borderRadius: 12,
    backgroundColor: C.primaria, alignItems: 'center',
  },
  btnSalvarTexto: { color: '#fff', fontWeight: '700' },
});
