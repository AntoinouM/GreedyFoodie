import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlobalClasses } from '../constants/classes';

function App() {
  return (
    <ThemedView style={GlobalClasses.container}>
      <SafeAreaView style={GlobalClasses.safeArea}>
        <ThemedText type="title" style={styles.title}>
          My Fridge
        </ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
});

export default App;
