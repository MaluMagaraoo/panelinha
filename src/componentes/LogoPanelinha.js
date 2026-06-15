import React from 'react';
import { Image } from 'react-native';

export default function LogoPanelinha({ size = 130 }) {
  return (
    <Image
      source={require('../../assets/logo.png')}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
}
