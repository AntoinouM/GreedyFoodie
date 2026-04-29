import { StyleSheet, Text, View } from 'react-native';

export default function RecipesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Recipes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121212',
  },
  text: { color: '#fff', fontSize: 18 },
});
