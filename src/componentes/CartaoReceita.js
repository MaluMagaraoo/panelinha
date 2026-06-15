import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, View } from 'react-native';

export default function CartaoReceita({ receita, aoClicar }) {
  return (
    <TouchableOpacity style={e.cartao} onPress={aoClicar} activeOpacity={0.85}>
      <Image source={{ uri: receita.strMealThumb }} style={e.imagem} />
      <View style={e.informacoes}>
        <Text style={e.titulo} numberOfLines={2}>{receita.strMeal}</Text>
        <View style={e.etiqueta}>
          <Text style={e.categoria}>{receita.strCategory}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const e = StyleSheet.create({
  cartao: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 7,
    flexDirection: 'row',
    shadowColor: '#6B4F3A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  imagem: { width: 110, height: 100 },
  informacoes: { flex: 1, padding: 14, justifyContent: 'center' },
  titulo: { fontSize: 15, fontWeight: '700', color: '#3D2B1F', lineHeight: 21, marginBottom: 8 },
  etiqueta: {
    alignSelf: 'flex-start',
    backgroundColor: '#FDF0E8',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  categoria: { fontSize: 12, color: '#E05C2A', fontWeight: '600' },
});
