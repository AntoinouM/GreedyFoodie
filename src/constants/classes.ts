// File to define global classes to be used accross the app

import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import '@/global.css';
import { StyleSheet } from 'react-native';

export const GlobalClasses = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
});
