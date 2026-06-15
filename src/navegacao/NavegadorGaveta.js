import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { autenticacao } from '../../firebaseConfig';
import { sair } from '../servicos/autenticacao';
import TelaPrincipal from '../telas/TelaPrincipal';
import TelaPerfil from '../telas/TelaPerfil';
import TelaDetalhes from '../telas/TelaDetalhes';
import TelaFavoritos from '../telas/TelaFavoritos';
import TelaConfiguracoes from '../telas/TelaConfiguracoes';

const Gaveta = createDrawerNavigator();
const Pilha = createStackNavigator();

const HEADER = {
  headerStyle: { backgroundColor: '#E05C2A', elevation: 0, shadowOpacity: 0 },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '700', fontSize: 18 },
};

const ITENS = [
  { rota: 'Início',         label: 'Início',        icone: 'home',          lib: 'Ionicons' },
  { rota: 'Favoritos',      label: 'Favoritos',     icone: 'heart',         lib: 'Ionicons' },
  { rota: 'Perfil',         label: 'Perfil',        icone: 'chef-hat',      lib: 'Material' },
  { rota: 'Configurações',  label: 'Configurações', icone: 'settings-sharp',lib: 'Ionicons' },
];

function Icone({ nome, lib, cor, tamanho = 22 }) {
  if (lib === 'Material') return <MaterialCommunityIcons name={nome} size={tamanho} color={cor} />;
  return <Ionicons name={nome} size={tamanho} color={cor} />;
}

function ConteudoGaveta({ navigation, state }) {
  const usuario = autenticacao.currentUser;
  const nomeCompleto = usuario?.displayName || 'Usuário';
  const email = usuario?.email || '';
  const iniciais = nomeCompleto.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  const AVATAR_EMOJI = { cozinheira: '👩‍🍳', cozinheiro: '👨‍🍳', neutro: '🧑‍🍳' };
  const avatarEmoji = AVATAR_EMOJI[usuario?.photoURL] || null;
  const rotaAtiva = state.routes[state.index]?.name;

  return (
    <View style={g.container}>
      {/* ── Cabeçalho laranja ── */}
      <View style={g.cabecalho}>
        <View style={g.avatar}>
          <Text style={avatarEmoji ? g.avatarEmoji : g.avatarTexto}>
            {avatarEmoji || iniciais}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={g.nome} numberOfLines={1}>{nomeCompleto}</Text>
          <Text style={g.email} numberOfLines={1}>{email}</Text>
        </View>
        <TouchableOpacity style={g.btnFechar} onPress={() => navigation.closeDrawer()}>
          <Ionicons name="close" size={16} color="#E05C2A" />
        </TouchableOpacity>
      </View>

      {/* ── Itens do menu ── */}
      <View style={g.menu}>
        {ITENS.map(item => {
          const ativo = rotaAtiva === item.rota;
          return (
            <TouchableOpacity
              key={item.rota}
              style={[g.item, ativo && g.itemAtivo]}
              onPress={() => navigation.navigate(item.rota)}
              activeOpacity={0.7}
            >
              <Icone nome={item.icone} lib={item.lib} cor={ativo ? '#E05C2A' : '#3D2B1F'} />
              <Text style={[g.itemLabel, ativo && g.itemLabelAtivo]}>{item.label}</Text>
              {ativo && <View style={g.barraAtiva} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Rodapé: Sair ── */}
      <View style={g.rodape}>
        <View style={g.separador} />
        <TouchableOpacity style={g.item} onPress={sair} activeOpacity={0.7}>
          <Ionicons name="exit-outline" size={22} color="#3D2B1F" />
          <Text style={g.itemLabel}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


function TelaSaida() {
  React.useEffect(() => { sair(); }, []);
  return null;
}

function PilhaInicio() {
  return (
    <Pilha.Navigator screenOptions={HEADER}>
      <Pilha.Screen name="TelaPrincipal" component={TelaPrincipal} options={{ headerShown: false }} />
      <Pilha.Screen name="TelaDetalhes" component={TelaDetalhes} options={{ headerShown: false }} />
    </Pilha.Navigator>
  );
}

export default function NavegadorGaveta() {
  return (
    <Gaveta.Navigator
      drawerContent={props => <ConteudoGaveta {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: '#fff', borderTopRightRadius: 24, borderBottomRightRadius: 24, width: 280 },
      }}
    >
      <Gaveta.Screen name="Início" component={PilhaInicio} />
      <Gaveta.Screen name="Favoritos" component={TelaFavoritos} />
      <Gaveta.Screen name="Perfil" component={TelaPerfil} options={{ headerShown: false }} />
      <Gaveta.Screen name="Configurações" component={TelaConfiguracoes} options={{ headerShown: false }} />
    </Gaveta.Navigator>
  );
}

const g = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', borderTopRightRadius: 24, borderBottomRightRadius: 24, overflow: 'hidden' },

  cabecalho: {
    backgroundColor: '#E05C2A',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTexto: { fontSize: 20, fontWeight: '700', color: '#E05C2A' },
  avatarEmoji: { fontSize: 28 },
  nome: { fontSize: 16, fontWeight: '700', color: '#fff' },
  email: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  btnFechar: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  menu: { flex: 1, paddingTop: 12, paddingHorizontal: 12 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 14,
    position: 'relative',
  },
  itemAtivo: { backgroundColor: '#FDF0E8' },
  itemLabel: { fontSize: 15, fontWeight: '600', color: '#3D2B1F', flex: 1 },
  itemLabelAtivo: { color: '#E05C2A' },
  barraAtiva: {
    position: 'absolute',
    right: 0,
    top: '20%',
    bottom: '20%',
    width: 4,
    borderRadius: 4,
    backgroundColor: '#E05C2A',
  },

  rodape: { paddingHorizontal: 12, paddingBottom: 32 },
  separador: { height: 1, backgroundColor: '#EDE0D4', marginVertical: 8, marginHorizontal: 2 },
});
