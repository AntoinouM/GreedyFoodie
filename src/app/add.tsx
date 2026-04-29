import { StyleSheet, Text, View } from 'react-native';

export default function AddScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Add food</Text>
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
