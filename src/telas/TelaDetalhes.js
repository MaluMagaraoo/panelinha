import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, ScrollView, StyleSheet,
  TouchableOpacity, Share, useWindowDimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { buscarReceitaPorId } from '../servicos/api';
import { traduzirTexto, traduzirIngredientes } from '../servicos/traducao';
import { useFavoritos } from '../hooks/useFavoritos';
import CarregandoSpinner from '../componentes/CarregandoSpinner';
import { autenticacao } from '../../firebaseConfig';

const C = {
  fundo: '#F5EDE0',
  card: '#FFFFFF',
  primaria: '#E05C2A',
  titulo: '#1A1A1A',
  texto: '#3D2B1F',
  sub: '#8C8C8C',
  estrela: '#F5A623',
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

function getAvaliacoes(id) {
  return 80 + (parseInt(id.slice(-3)) % 200);
}

function getChef(area) {
  const chefs = {
    Italian: 'Chef Mario Rossi', Mexican: 'Chef Carlos Vega',
    Indian: 'Chef Priya Sharma', French: 'Chef Jean Dupont',
    Japanese: 'Chef Kenji Tanaka', British: 'Chef James Cook',
    American: 'Chef John Smith', Thai: 'Chef Somchai Lee',
    Spanish: 'Chef Ana Lima', Greek: 'Chef Nikos Papadopoulos',
    Chinese: 'Chef Wei Zhang',
  };
  return chefs[area] || 'Chef Panelinha';
}

export default function TelaDetalhes({ route, navigation }) {
  const { idReceita } = route.params;
  const { width, height } = useWindowDimensions();
  const [receita, setReceita] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState('ingredientes');
  const [checados, setChecados] = useState({});
  const [ingredientesPT, setIngredientesPT] = useState([]);
  const [instrucoesPT, setInstrucoesPT] = useState('');
  const [traduzindo, setTraduzindo] = useState(false);

  const usuario = autenticacao.currentUser;
  const { ehFavorito, alternarFavorito } = useFavoritos(usuario?.uid);

  useEffect(() => {
    buscarReceitaPorId(idReceita).then(async dados => {
      setReceita(dados);
      setCarregando(false);

      // Extrai ingredientes do objeto retornado
      const ings = [];
      for (let i = 1; i <= 20; i++) {
        const ing = dados[`strIngredient${i}`];
        const med = dados[`strMeasure${i}`];
        if (ing && ing.trim()) ings.push(`${med?.trim() ?? ''} ${ing.trim()}`.trim());
      }

      setTraduzindo(true);
      const [ingsPT, instrPT] = await Promise.all([
        traduzirIngredientes(ings),
        traduzirTexto(dados.strInstructions || ''),
      ]);
      setIngredientesPT(ingsPT);
      setInstrucoesPT(instrPT);
      setTraduzindo(false);
    });
  }, [idReceita]);

  if (carregando) return <CarregandoSpinner mensagem="Carregando receita..." />;
  if (!receita) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.fundo }}>
      <Text style={{ color: C.sub }}>Receita não encontrada</Text>
    </View>
  );

  const ingredientes = [];
  for (let i = 1; i <= 20; i++) {
    const ing = receita[`strIngredient${i}`];
    const med = receita[`strMeasure${i}`];
    if (ing && ing.trim()) ingredientes.push(`${med?.trim() ?? ''} ${ing.trim()}`.trim());
  }

  const dif = getDificuldade(receita.strCategory);
  const tempo = getTempo(receita.idMeal);
  const rating = getRating(receita.idMeal);
  const avaliacoes = getAvaliacoes(receita.idMeal);
  const chef = getChef(receita.strArea);
  const favorito = ehFavorito(receita.idMeal);

  const compartilhar = () => {
    Share.share({ message: `Confira essa receita: ${receita.strMeal}` });
  };

  return (
    <View style={{ height, backgroundColor: C.fundo }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* ── Imagem com botões sobrepostos ── */}
        <View>
          <Image source={{ uri: receita.strMealThumb }} style={[e.imagem, { width }]} />
          <TouchableOpacity style={e.btnVoltar} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#3D2B1F" />
          </TouchableOpacity>
          <TouchableOpacity style={e.btnFavorito} onPress={() => alternarFavorito(receita)}>
            <Ionicons name={favorito ? 'heart' : 'heart-outline'} size={20} color={favorito ? C.primaria : '#3D2B1F'} />
          </TouchableOpacity>
        </View>

        {/* ── Corpo ── */}
        <View style={e.corpo}>

          {/* Título e chef */}
          <Text style={e.titulo}>{receita.strMeal}</Text>
          <Text style={e.chef}>Por {chef}</Text>

          {/* Avaliação */}
          <View style={e.ratingRow}>
            {[1,2,3,4,5].map(s => (
              <Ionicons key={s} name={s <= Math.round(parseFloat(rating)) ? 'star' : 'star-outline'} size={16} color={C.estrela} />
            ))}
            <Text style={e.ratingTexto}> {rating} · {avaliacoes} avaliações</Text>
          </View>

          {/* Info: tempo, porções, dificuldade */}
          <View style={e.infoRow}>
            <View style={e.infoItem}>
              <Ionicons name="time-outline" size={22} color={C.primaria} />
              <Text style={e.infoValor}>{tempo}</Text>
              <Text style={e.infoLabel}>Tempo</Text>
            </View>
            <View style={e.infoDivisor} />
            <View style={e.infoItem}>
              <Ionicons name="people-outline" size={22} color={C.primaria} />
              <Text style={e.infoValor}>4 pessoas</Text>
              <Text style={e.infoLabel}>Porções</Text>
            </View>
            <View style={e.infoDivisor} />
            <View style={e.infoItem}>
              <MaterialCommunityIcons name="chef-hat" size={22} color={C.primaria} />
              <Text style={e.infoValor}>{dif}</Text>
              <Text style={e.infoLabel}>Dificuldade</Text>
            </View>
          </View>

          {/* Abas */}
          <View style={e.abas}>
            <TouchableOpacity
              style={[e.aba, abaAtiva === 'ingredientes' && e.abaAtiva]}
              onPress={() => setAbaAtiva('ingredientes')}
            >
              <Text style={[e.abaTexto, abaAtiva === 'ingredientes' && e.abaTextoAtivo]}>Ingredientes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[e.aba, abaAtiva === 'preparo' && e.abaAtiva]}
              onPress={() => setAbaAtiva('preparo')}
            >
              <Text style={[e.abaTexto, abaAtiva === 'preparo' && e.abaTextoAtivo]}>Modo de Preparo</Text>
            </TouchableOpacity>
          </View>

          {/* Conteúdo das abas */}
          {traduzindo ? (
            <View style={e.traduzindoBox}>
              <Ionicons name="language-outline" size={20} color={C.primaria} />
              <Text style={e.traduzindoTexto}>Traduzindo para português...</Text>
            </View>
          ) : abaAtiva === 'ingredientes' ? (
            <View style={e.listaIngredientes}>
              {(ingredientesPT.length ? ingredientesPT : ingredientes).map((ing, i) => (
                <TouchableOpacity
                  key={i}
                  style={e.ingredienteItem}
                  onPress={() => setChecados(prev => ({ ...prev, [i]: !prev[i] }))}
                  activeOpacity={0.7}
                >
                  <View style={[e.checkbox, checados[i] && e.checkboxAtivo]}>
                    {checados[i] && <Ionicons name="checkmark" size={13} color="#fff" />}
                  </View>
                  <Text style={[e.ingredienteTexto, checados[i] && e.ingredienteRiscado]}>
                    {ing}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={e.instrucoes}>{instrucoesPT || receita.strInstructions}</Text>
          )}
        </View>
      </ScrollView>

      {/* ── Botão Compartilhar flutuante ── */}
      <TouchableOpacity style={e.btnCompartilhar} onPress={compartilhar} activeOpacity={0.85}>
        <Ionicons name="share-social-outline" size={18} color="#fff" />
        <Text style={e.btnCompartilharTexto}>Compartilhar</Text>
      </TouchableOpacity>
    </View>
  );
}

const e = StyleSheet.create({
  imagem: { height: 280 },

  btnVoltar: {
    position: 'absolute', top: 48, left: 16,
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 4,
  },
  btnFavorito: {
    position: 'absolute', top: 48, right: 16,
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 4,
  },

  corpo: {
    backgroundColor: C.fundo,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  titulo: { fontSize: 24, fontWeight: '700', color: C.titulo, marginBottom: 4, lineHeight: 32 },
  chef: { fontSize: 13, color: C.sub, marginBottom: 10 },

  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  ratingTexto: { fontSize: 13, color: C.sub, marginLeft: 4 },

  infoRow: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 24,
    shadowColor: '#6B4F3A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
  },
  infoItem: { flex: 1, alignItems: 'center', gap: 4 },
  infoValor: { fontSize: 13, fontWeight: '700', color: C.titulo },
  infoLabel: { fontSize: 11, color: C.sub },
  infoDivisor: { width: 1, backgroundColor: '#EDE0D4', marginVertical: 4 },

  abas: {
    flexDirection: 'row',
    backgroundColor: '#EDE0D4',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  aba: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  abaAtiva: { backgroundColor: C.primaria },
  abaTexto: { fontSize: 14, fontWeight: '600', color: C.texto },
  abaTextoAtivo: { color: '#fff' },

  listaIngredientes: { gap: 4 },
  ingredienteItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 14 },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 2, borderColor: '#D4C4B8',
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxAtivo: { backgroundColor: C.primaria, borderColor: C.primaria },
  ingredienteTexto: { fontSize: 15, color: C.texto, flex: 1 },
  ingredienteRiscado: { textDecorationLine: 'line-through', color: C.sub },

  instrucoes: { fontSize: 15, color: C.texto, lineHeight: 26 },

  traduzindoBox: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 20, justifyContent: 'center' },
  traduzindoTexto: { fontSize: 14, color: C.sub, fontStyle: 'italic' },

  btnCompartilhar: {
    position: 'absolute', bottom: 28, right: 20,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: C.primaria,
    paddingHorizontal: 22, paddingVertical: 14,
    borderRadius: 30,
    shadowColor: '#E05C2A', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
  },
  btnCompartilharTexto: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
