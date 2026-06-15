import React from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { autenticacao } from '../../firebaseConfig';
import { useFavoritos } from '../hooks/useFavoritos';
import CarregandoSpinner from '../componentes/CarregandoSpinner';

const C = {
  fundo: '#F5EDE0',
  card: '#FFFFFF',
  primaria: '#E05C2A',
  titulo: '#1A1A1A',
  texto: '#3D2B1F',
  sub: '#8C8C8C',
};

function CardFavorito({ item, aoAbrir, aoRemover }) {
  return (
    <TouchableOpacity style={e.card} onPress={aoAbrir} activeOpacity={0.88}>
      <Image source={{ uri: item.imagemReceita }} style={e.imagem} />
      <View style={e.info}>
        <Text style={e.nome} numberOfLines={2}>{item.nomeReceita}</Text>
        {item.categoriaReceita ? (
          <View style={e.badge}>
            <Text style={e.badgeTexto}>{item.categoriaReceita}</Text>
          </View>
        ) : null}
      </View>
      <TouchableOpacity style={e.btnRemover} onPress={aoRemover} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="heart" size={20} color={C.primaria} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

function EstadoVazio() {
  return (
    <View style={e.vazio}>
      <Ionicons name="heart-outline" size={64} color="#D4C4B8" />
      <Text style={e.vazioTitulo}>Nenhum favorito ainda</Text>
      <Text style={e.vazioSub}>Toque no ♡ de qualquer receita para salvar aqui</Text>
    </View>
  );
}

export default function TelaFavoritos({ navigation }) {
  const { height } = useWindowDimensions();
  const usuario = autenticacao.currentUser;
  const { favoritos, carregando, alternarFavorito } = useFavoritos(usuario?.uid);

  if (carregando) return <CarregandoSpinner mensagem="Carregando favoritos..." />;

  const abrirReceita = (idReceita) => {
    navigation.navigate('Início', {
      screen: 'TelaDetalhes',
      params: { idReceita },
    });
  };

  const removerFavorito = (item) => {
    alternarFavorito({
      idMeal: item.idReceita,
      strMeal: item.nomeReceita,
      strMealThumb: item.imagemReceita,
      strCategory: item.categoriaReceita,
    });
  };

  return (
    <View style={{ height, backgroundColor: C.fundo }}>
      {/* Cabeçalho */}
      <View style={e.header}>
        <View>
          <Text style={e.headerTitulo}>Meus Favoritos</Text>
          <Text style={e.headerSub}>{favoritos.length} receita{favoritos.length !== 1 ? 's' : ''} salva{favoritos.length !== 1 ? 's' : ''}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.openDrawer()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="menu" size={28} color={C.titulo} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={favoritos}
        keyExtractor={item => item.idReceita}
        renderItem={({ item }) => (
          <CardFavorito
            item={item}
            aoAbrir={() => abrirReceita(item.idReceita)}
            aoRemover={() => removerFavorito(item)}
          />
        )}
        ListEmptyComponent={<EstadoVazio />}
        contentContainerStyle={favoritos.length === 0 ? { flex: 1 } : { paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const e = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 20,
    backgroundColor: C.fundo,
  },
  headerTitulo: { fontSize: 28, fontWeight: '700', color: C.titulo },
  headerSub: { fontSize: 14, color: C.sub, marginTop: 4 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    shadowColor: '#6B4F3A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  imagem: { width: 72, height: 72, borderRadius: 12 },
  info: { flex: 1, marginLeft: 12 },
  nome: { fontSize: 14, fontWeight: '700', color: C.texto, lineHeight: 20, marginBottom: 6 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FDF0E8',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeTexto: { fontSize: 11, color: C.primaria, fontWeight: '600' },
  btnRemover: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#FDF0E8',
  },

  vazio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 40,
  },
  vazioTitulo: { fontSize: 18, fontWeight: '700', color: '#A08878' },
  vazioSub: { fontSize: 14, color: C.sub, textAlign: 'center', lineHeight: 22 },
});
