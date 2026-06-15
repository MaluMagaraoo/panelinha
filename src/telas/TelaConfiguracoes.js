import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Switch, StyleSheet,
  ScrollView, Alert, useWindowDimensions, Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { autenticacao } from '../../firebaseConfig';
import { sair } from '../servicos/autenticacao';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from 'firebase/auth';

const C = {
  fundo: '#F5EDE0',
  card: '#FFFFFF',
  primaria: '#E05C2A',
  titulo: '#1A1A1A',
  texto: '#3D2B1F',
  sub: '#8C8C8C',
  secao: '#A08878',
  perigo: '#E05C2A',
};

function IconeItem({ nome, lib = 'Ionicons' }) {
  return (
    <View style={e.iconeBox}>
      {lib === 'Material'
        ? <MaterialCommunityIcons name={nome} size={20} color="#fff" />
        : <Ionicons name={nome} size={20} color="#fff" />
      }
    </View>
  );
}

function ItemToggle({ icone, lib, titulo, subtitulo, valor, aoMudar }) {
  return (
    <View style={e.item}>
      <IconeItem nome={icone} lib={lib} />
      <View style={e.itemTextos}>
        <Text style={e.itemTitulo}>{titulo}</Text>
        <Text style={e.itemSub}>{subtitulo}</Text>
      </View>
      <Switch
        value={valor}
        onValueChange={aoMudar}
        trackColor={{ false: '#D4C4B8', true: C.primaria }}
        thumbColor="#fff"
        ios_backgroundColor="#D4C4B8"
      />
    </View>
  );
}

function ItemSeta({ icone, lib, titulo, subtitulo, aoClicar, perigo = false }) {
  return (
    <TouchableOpacity style={e.item} onPress={aoClicar} activeOpacity={0.7}>
      <IconeItem nome={icone} lib={lib} />
      <View style={e.itemTextos}>
        <Text style={[e.itemTitulo, perigo && { color: C.perigo }]}>{titulo}</Text>
        <Text style={e.itemSub}>{subtitulo}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#D4C4B8" />
    </TouchableOpacity>
  );
}

function Secao({ titulo, children }) {
  return (
    <View style={e.secaoContainer}>
      <Text style={e.secaoTitulo}>{titulo}</Text>
      <View style={e.card}>{children}</View>
    </View>
  );
}

function Divisor() {
  return <View style={e.divisor} />;
}

export default function TelaConfiguracoes({ navigation }) {
  const { height } = useWindowDimensions();
  const [notificacoes, setNotificacoes] = useState(true);
  const [temaEscuro, setTemaEscuro] = useState(false);

  const alterarSenha = () => {
    Alert.alert(
      'Alterar senha',
      'Um e-mail de redefinição será enviado para ' + autenticacao.currentUser?.email,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          onPress: () => Alert.alert('E-mail enviado!', 'Verifique sua caixa de entrada.'),
        },
      ]
    );
  };

  const excluirConta = () => {
    Alert.alert(
      'Excluir conta',
      'Esta ação é irreversível. Todos os seus dados serão apagados permanentemente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUser(autenticacao.currentUser);
            } catch {
              Alert.alert('Erro', 'Faça login novamente antes de excluir a conta.');
            }
          },
        },
      ]
    );
  };

  const emBreve = (funcionalidade) => {
    Alert.alert(funcionalidade, 'Esta funcionalidade estará disponível em breve.');
  };

  return (
    <View style={{ height, backgroundColor: C.fundo }}>
      {/* Cabeçalho */}
      <View style={e.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="menu" size={26} color={C.titulo} />
        </TouchableOpacity>
        <Text style={e.headerTitulo}>Configurações</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* PREFERÊNCIAS */}
        <Secao titulo="PREFERÊNCIAS">
          <ItemToggle
            icone="notifications-outline"
            titulo="Notificações"
            subtitulo="Receba alertas de novas receitas"
            valor={notificacoes}
            aoMudar={setNotificacoes}
          />
          <Divisor />
          <ItemToggle
            icone="moon-outline"
            titulo="Tema escuro"
            subtitulo="Aparência do aplicativo"
            valor={temaEscuro}
            aoMudar={setTemaEscuro}
          />
          <Divisor />
          <ItemSeta
            icone="globe-outline"
            titulo="Idioma"
            subtitulo="Português (Brasil)"
            aoClicar={() => emBreve('Idioma')}
          />
        </Secao>

        {/* CONTA */}
        <Secao titulo="CONTA">
          <ItemSeta
            icone="lock-closed-outline"
            titulo="Alterar senha"
            subtitulo="Atualize sua senha de acesso"
            aoClicar={alterarSenha}
          />
          <Divisor />
          <ItemSeta
            icone="trash-outline"
            titulo="Excluir conta"
            subtitulo="Ação irreversível"
            aoClicar={excluirConta}
            perigo
          />
        </Secao>

        {/* SOBRE */}
        <Secao titulo="SOBRE">
          <ItemSeta
            icone="help-circle-outline"
            titulo="Ajuda & Suporte"
            subtitulo="Tire suas dúvidas"
            aoClicar={() => emBreve('Ajuda & Suporte')}
          />
          <Divisor />
          <ItemSeta
            icone="document-text-outline"
            titulo="Termos de uso"
            subtitulo="Leia nossa política"
            aoClicar={() => emBreve('Termos de uso')}
          />
        </Secao>

        {/* Rodapé */}
        <View style={e.rodape}>
          <Text style={e.rodapeVersao}>Panelinha v1.0.0</Text>
          <Text style={e.rodapeCredito}>Criado por Maria Luiza Magarão · 22408637</Text>
        </View>

      </ScrollView>
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
    paddingBottom: 16,
  },
  headerTitulo: {
    fontSize: 20,
    fontWeight: '700',
    fontStyle: 'italic',
    color: C.titulo,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },

  secaoContainer: { paddingHorizontal: 16, marginBottom: 8 },
  secaoTitulo: {
    fontSize: 11,
    fontWeight: '700',
    color: C.secao,
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: C.card,
    borderRadius: 16,
    shadowColor: '#6B4F3A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  iconeBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: C.primaria,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTextos: { flex: 1 },
  itemTitulo: { fontSize: 15, fontWeight: '600', color: C.texto },
  itemSub: { fontSize: 12, color: C.sub, marginTop: 2 },

  divisor: { height: 1, backgroundColor: '#F0E8E0', marginLeft: 68 },

  rodape: { alignItems: 'center', paddingVertical: 24, gap: 4 },
  rodapeVersao: { fontSize: 13, fontWeight: '600', color: C.primaria },
  rodapeCredito: { fontSize: 12, color: C.sub },
});
