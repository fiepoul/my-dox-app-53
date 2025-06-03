import { HEADER_HEIGHT } from '@/utils/constants';
import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
        backgroundColor: '#fff',
        paddingTop: HEADER_HEIGHT + 24
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emptyText: {
    color: '#aaa',
    fontSize: 14,
    fontStyle: 'italic',
    paddingLeft: 4,
  },
  accentStripe: {
    width: 80,
    height: 4,
    backgroundColor: '#0047ff',
    marginBottom: 8,
    transform: [{ rotate: '-8deg' }], // surreal hint
  },
  headerMain: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: '#000',
    transform: [{ skewX: '-3deg' }], // Bauhaus/surreal hint
    marginBottom: 6,
  },
  headerSub: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 12,
    paddingHorizontal: 20,
    letterSpacing: 1,
  },
  headerBlock: {
    marginBottom: 24,
    alignItems: 'center',
    zIndex: 1,
  },
  posterWrap: {
        borderRadius: 4,
        overflow: 'hidden',
       },
       poster: {
         width: 130,
         height: 190,
         backgroundColor: '#0047ff',
         justifyContent: 'center',
         alignItems: 'center',
         padding: 14,
       },
       posterText: {
         color: '#fff',
         fontSize: 13,
         fontWeight: '800',
         textAlign: 'center',
         textTransform: 'uppercase',
         letterSpacing: 0.5,
       },
});