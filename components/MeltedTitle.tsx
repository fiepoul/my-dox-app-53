import { commonStyles } from '@/styles/CommonStyles';
import React from 'react';
import { Animated, TextStyle } from 'react-native';

type Props = {
  meltAnim: Animated.Value;
  text: string;
  style?: TextStyle;
};

export default function MeltedTitle({ meltAnim, text, style }: Props) {
  return (
    <Animated.Text
      style={[
        commonStyles.headerMain,
        style,
        {
          transform: [
            {
              skewX: meltAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '12deg'],
              }),
            },
            {
              translateY: meltAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 8],
              }),
            },
          ],
          opacity: meltAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.8],
          }),
        },
      ]}
    >
      {text}
    </Animated.Text>
  );
}