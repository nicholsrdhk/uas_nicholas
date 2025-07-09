// app/+not-found.tsx

import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const COLORS = {
  background: '#121212',
  accent: '#009B77',
  textTitle: '#F5F5F5',
  textDesc: '#A8A8A8',
  uiSecondary: '#222222',
};

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <Feather name="compass" size={90} color={COLORS.uiSecondary} />
        <Text style={styles.title}>Halaman Tidak Ditemukan</Text>
        <Text style={styles.subtitle}>
          Sepertinya Anda tersesat. Mari kita kembali ke jalan yang benar.
        </Text>
        
        <Link href="/home" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Kembali ke Halaman Utama</Text>
          </Pressable>
        </Link>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontFamily: 'PlusJakartaSans',
    fontWeight: 'bold',
    fontSize: 24,
    color: COLORS.textTitle,
    marginTop: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans',
    fontSize: 16,
    color: COLORS.textDesc,
    marginTop: 8,
    textAlign: 'center',
    maxWidth: '80%',
  },
  button: {
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 32,
  },
  buttonText: {
    fontFamily: 'PlusJakartaSans',
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.textTitle,
  },
});