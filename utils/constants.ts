// constants.js
import { Platform, StatusBar } from 'react-native';

export const HEADER_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 60 : 60
