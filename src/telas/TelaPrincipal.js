import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, ScrollView,
  TouchableOpacity, Image, StyleSheet, useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { autenticacao } from '../../firebaseConfig';
import { useReceitas } from '../hooks/useReceitas';
import CarregandoSpinner from '../componentes/CarregandoSpinner';

const C = {
  fundo: '#F5EDE0',
  card: '#FFFFFF',
  primaria: '#E05C2A',
  titulo: '#1A1A1A',
  texto: '#3D2B1F',
  sub: '#8C8C8C',
  placeholder: '#BCA99A',
  star: '#F5A623',
};

const CAT_MAP = {
  Beef: 'Carnes', Chicken: 'Carnes', Lamb: 'Carnes', Pork: 'Carnes',
  Pasta: 'Massas',
  Miscellaneous: 'Sopas', Seafood: 'Sopas', Soup: 'Sopas',
  Vegetarian: 'Vegetariano', Vegan: 'Vegetariano',
  Dessert: 'Sobremesas', Breakfast: 'Café da manhã',
};

function getDificuldade(cat) {
  if (['Seafood', 'Lamb'].includes(cat)) return 'Difícil';
  if (['Pasta', 'Chicken', 'Vegetarian', 'Dessert'].includes(cat)) return 'Fácil';
  return 'Médio';
}

function getTempo(id) {
  const t = ['20 min', '30 min', '45 min', '1h', '1h 20min', '25 min', '50 min', '35 min'];
  return t[parseInt(id.slice(-2)) % t.length];
}

function getRating(id) {
  return (4.5 + (parseInt(id.slice(-1)) % 6) * 0.08).toFixed(1);
}

function CardDestaque({ receita, aoClicar }) {
  const dif = getDificuldade(receita.strCategory);
  const tempo = getTempo(receita.idMeal);
  return (
    <TouchableOpacity style={d.card} onPress={aoClicar} activeOpacity={0.88}>
      <View>
        <Image source={{ uri: receita.strMealThumb }} style={d.imagem} />
        <View style={d.badge}>
          <Text style={d.badgeTexto}>{dif}</Text>
        </View>
      </View>
      <View style={d.info}>
        <Text style={d.nome} numberOfLines={2}>{receita.strMeal}</Text>
        <View style={d.linha}>
          <Ionicons name="time-outline" size={13} color={C.placeholder} />
          <Text style={d.tempo}> {tempo}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function CardLista({ receita, aoClicar }) {
  const dif = getDificuldade(receita.strCategory);
  const tempo = getTempo(receita.idMeal);
  const rating = getRating(receita.idMeal);
  const chef = receita.strArea ? `Chef ${receita.strArea}` : 'Chef Panelinha';
  return (
    <TouchableOpacity style={l.card} onPress={aoClicar} activeOpacity={0.88}>
      <Image source={{ uri: receita.strMealThumb }} style={l.imagem} />
      <View style={l.info}>
        <Text style={l.nome} numberOfLines={2}>{receita.strMeal}</Text>
        <Text style={l.chef}>{chef}</Text>
        <View style={l.rodape}>
          <Ionicons name="time-outline" size={12} color={C.placeholder} />
          <Text style={l.tempo}> {tempo}  </Text>
          <View style={l.difBadge}>
            <Text style={l.difTexto}>{dif}</Text>
          </View>
        </View>
      </View>
      <View style={l.rating}>
        <Ionicons name="star" size={14} color={C.star} />
        <Text style={l.ratingTexto}>{rating}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function TelaPrincipal({ navigation }) {
  const { height } = useWindowDimensions();
  const [textoBusca, setTextoBusca] = useState('');
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todas');
  const { receitas, carregando, erro } = useReceitas(termoPesquisa);

  const usuario = autenticacao.currentUser;
  const nome = usuario?.displayName?.split(' ')[0] || 'Chef';

  const categorias = useMemo(() => {
    const cats = new Set(receitas.map(r => CAT_MAP[r.strCategory] || r.strCategory));
    return ['Todas', ...cats];
  }, [receitas]);

  const receitasFiltradas = useMemo(() => {
    if (categoriaAtiva === 'Todas') return receitas;
    return receitas.filter(r => (CAT_MAP[r.strCategory] || r.strCategory) === categoriaAtiva);
  }, [receitas, categoriaAtiva]);

  const emAlta = receitas.slice(0, 6);

  if (carregando) return <CarregandoSpinner mensagem="Buscando receitas..." />;

  const cabecalho = (
    <View>
      {/* Saudação */}
      <View style={h.header}>
        <View>
          <Text style={h.boasVindas}>Bem-vindo(a) de volta!</Text>
          <Text style={h.saudacao}>Olá, {nome} 👋</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="menu" size={28} color={C.titulo} />
        </TouchableOpacity>
      </View>

      {/* Busca */}
      <View style={h.buscaBox}>
        <Ionicons name="search" size={18} color={C.placeholder} style={{ marginLeft: 14 }} />
        <TextInput
          style={h.buscaCampo}
          placeholder="Buscar receitas..."
          placeholderTextColor={C.placeholder}
          value={textoBusca}
          onChangeText={setTextoBusca}
          onSubmitEditing={() => setTermoPesquisa(textoBusca)}
          returnKeyType="search"
        />
      </View>

      {/* Categorias */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={h.cats}
      >
        {categorias.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[h.pill, categoriaAtiva === cat && h.pillAtiva]}
            onPress={() => setCategoriaAtiva(cat)}
          >
            <Text style={[h.pillTexto, categoriaAtiva === cat && h.pillTextoAtivo]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Em Alta */}
      <View style={h.secaoHeader}>
        <Text style={h.secaoTitulo}>Em Alta 🔥</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={h.emAltaScroll}
      >
        {emAlta.map(r => (
          <CardDestaque
            key={r.idMeal}
            receita={r}
            aoClicar={() => navigation.navigate('TelaDetalhes', { idReceita: r.idMeal })}
          />
        ))}
      </ScrollView>

      {erro && (
        <Text style={{ color: '#C0392B', marginHorizontal: 16, marginTop: 8 }}>
          Erro ao carregar receitas
        </Text>
      )}

      {/* Título da lista */}
      <Text style={h.todasTitulo}>Todas as Receitas</Text>
    </View>
  );

  return (
    <ScrollView
      style={{ height, backgroundColor: C.fundo }}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {cabecalho}

      {receitasFiltradas.length === 0
        ? <Text style={{ textAlign: 'center', color: C.placeholder, marginTop: 32, fontSize: 15 }}>Nenhuma receita encontrada</Text>
        : receitasFiltradas.map(item => (
            <CardLista
              key={item.idMeal}
              receita={item}
              aoClicar={() => navigation.navigate('TelaDetalhes', { idReceita: item.idMeal })}
            />
          ))
      }
    </ScrollView>
  );
}

/* ─── Header / busca / categorias ─── */
const h = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  boasVindas: { fontSize: 13, color: '#E05C2A', fontWeight: '500' },
  saudacao: { fontSize: 26, fontWeight: '700', color: C.titulo, marginTop: 2 },

  buscaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#6B4F3A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  buscaCampo: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 14,
    fontSize: 15,
    color: C.texto,
  },

  cats: { paddingHorizontal: 16, paddingBottom: 4, gap: 8 },
  pill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: '#EDE0D4',
  },
  pillAtiva: { backgroundColor: C.primaria, borderColor: C.primaria },
  pillTexto: { fontSize: 14, fontWeight: '600', color: C.texto },
  pillTextoAtivo: { color: '#fff' },

  secaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  secaoTitulo: { fontSize: 18, fontWeight: '700', color: C.titulo },
  emAltaScroll: { paddingHorizontal: 16, gap: 12, paddingBottom: 4 },

  todasTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: C.titulo,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 10,
  },
});

/* ─── Card "Em Alta" (horizontal) ─── */
const d = StyleSheet.create({
  card: {
    width: 165,
    backgroundColor: C.card,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#6B4F3A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  imagem: { width: 165, height: 130 },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: C.primaria,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeTexto: { color: '#fff', fontSize: 11, fontWeight: '700' },
  info: { padding: 10 },
  nome: { fontSize: 13, fontWeight: '700', color: C.texto, marginBottom: 6, lineHeight: 18 },
  linha: { flexDirection: 'row', alignItems: 'center' },
  tempo: { fontSize: 12, color: C.placeholder },
});

/* ─── Card lista "Todas as Receitas" ─── */
const l = StyleSheet.create({
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
  nome: { fontSize: 14, fontWeight: '700', color: C.texto, marginBottom: 3, lineHeight: 20 },
  chef: { fontSize: 12, color: C.sub, marginBottom: 6 },
  rodape: { flexDirection: 'row', alignItems: 'center' },
  tempo: { fontSize: 12, color: C.placeholder },
  difBadge: {
    backgroundColor: '#FDF0E8',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  difTexto: { fontSize: 11, color: C.primaria, fontWeight: '600' },
  rating: { alignItems: 'center', marginLeft: 8 },
  ratingTexto: { fontSize: 13, fontWeight: '700', color: C.texto, marginTop: 2 },
});
