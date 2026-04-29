import { View, type ViewProps } from 'react-native';

import { Colors, ThemeColor } from '@/constants/theme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemeColor;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  type,
  ...otherProps
}: ThemedViewProps) {
  const colors = Colors.light;

  return (
    <View
      style={[{ backgroundColor: colors[type ?? 'background'] }, style]}
      {...otherProps}
    />
  );
}
