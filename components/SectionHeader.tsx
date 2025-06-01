import { commonStyles } from '@/styles/CommonStyles'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

type SectionHeaderProps = {
  title: string
  subtitle: string
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <>
      <View style={styles.orangeShape} />
      <View style={styles.accentStripe} />
      <Text style={commonStyles.headerMain}>{title}</Text>
      <Text style={commonStyles.headerSub}>{subtitle}</Text>
    </>
  )
}

const styles = StyleSheet.create({
  orangeShape: {
    width: 80,
    height: 6,
    backgroundColor: '#FF8C00',
    marginBottom: 6,
    transform: [{ rotate: '12deg' }],
    alignSelf: 'center',
  },
  accentStripe: {
    width: 100,
    height: 4,
    backgroundColor: '#0047ff',
    marginBottom: 8,
    transform: [{ rotate: '-6deg' }],
    alignSelf: 'center',
  },
})
