import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Types/navigation';

const BASE_URL = 'https://cemear-testes-443a098c8bb8.herokuapp.com';

const LoginScreen: React.FC = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        navigation.replace('Home'); // Redireciona para Home se autenticado
      }
    };
    checkToken();
  }, [navigation]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        usuario,
        password,
      });

      const { token, tipoUsuario, userId } = response.data;
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('tipoUsuario', tipoUsuario);
      await AsyncStorage.setItem('userId', userId);

      Alert.alert('Login bem-sucedido', 'Você está autenticado!');
      navigation.replace('Home');
    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert('Erro', 'Usuário ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Entre para continuar</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Usuário"
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
      <Text style={styles.link}>
        CEMEAR COMERCIO E REPRESENTACAO LTDA
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      padding: 20,
    },
    logo: {
      width: 150,
      height: 150,
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: '#333',
      marginBottom: 20,
    },
    form: {
      width: '100%',
      maxWidth: 400,
      backgroundColor: '#ffffff',
      padding: 20,
      borderRadius: 8,
      // Aplicando sombra compatível com React Native
      elevation: 5, // Sombras no Android
      shadowColor: '#000', // Sombras no iOS
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    input: {
      width: '100%',
      height: 50,
      backgroundColor: '#fff',
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    button: {
      backgroundColor: '#007AFF',
      width: '100%',
      padding: 15,
      alignItems: 'center',
      borderRadius: 8,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    link: {
      color: '#0079bf',
      textAlign: 'center',
      marginTop: 20,
    },
  });
  
export default LoginScreen;
