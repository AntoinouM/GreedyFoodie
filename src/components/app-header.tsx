import { GlobalClasses } from '@/constants/classes';
import { Spacing } from '@/constants/theme';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from './themed-view';

export default function AppHeader() {
  return (
    <ThemedView style={GlobalClasses.container}>
      <View style={styles.topBar}>
        <Image
          style={styles.logo}
          source={require('@/assets/images/logo-light.png')}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    display: 'flex',
    flexDirection: 'row',
    gap: Spacing.three,
  },
  logo: {
    width: Spacing.five,
    height: Spacing.five,
  },
});
