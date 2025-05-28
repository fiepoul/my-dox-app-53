// This code is part of a React Native component that creates a surreal background with animated shapes and a dynamic heading. The shapes move and transform based on the provided animations, creating an engaging visual effect.
import React from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHAPE_SIZE = 200;

type Props = {
  circAnim: Animated.Value;
  rectAnim: Animated.Value;
};

export default function SurrealBackground({ circAnim, rectAnim }: Props) {
  return (
    <>
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [
              {
                translateX: circAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-SHAPE_SIZE, SCREEN_WIDTH * 0.7],
                }),
              },
              {
                translateY: circAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-SHAPE_SIZE * 0.6, SCREEN_HEIGHT * 0.3],
                }),
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.rect,
          {
            transform: [
              {
                rotate: rectAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    width: SHAPE_SIZE,
    height: SHAPE_SIZE,
    borderRadius: SHAPE_SIZE / 2,
    backgroundColor: 'rgba(0,68,255,0.1)',
  },
  rect: {
    position: 'absolute',
    width: SHAPE_SIZE * 1.3,
    height: SHAPE_SIZE * 0.4,
    backgroundColor: 'rgba(255,64,129,0.1)',
  },
});
