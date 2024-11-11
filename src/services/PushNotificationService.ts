import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BASE_URL = 'https://cemear-b549eb196d7c.herokuapp.com';

class PushNotificationService {
  private onRegisterCallback: (token: string) => void = () => {};

  configure = () => {
    PushNotification.configure({
      onRegister: async (token) => {
        console.log('TOKEN:', token);
        await this.storeAndSendToken(token.token);
        this.onRegisterCallback(token.token);
      },
      onNotification: (notification) => {
        console.log('NOTIFICATION:', notification);
        notification.finish(PushNotification.FetchResult.NoData);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  };

  setOnRegister = (callback: (token: string) => void) => {
    this.onRegisterCallback = callback;
  };

  private storeAndSendToken = async (token: string) => {
    try {
      const storedToken = await AsyncStorage.getItem('pushToken');

      if (storedToken !== token) {
        await AsyncStorage.setItem('pushToken', token);
        console.log('Token armazenado com sucesso.');

        // Envia o token para o backend
        const response = await axios.post(`${BASE_URL}/save-push-token`, { token });
        if (response.status === 200) {
          console.log('Token enviado ao backend com sucesso.');
        } else {
          console.error('Erro na resposta do backend ao enviar token:', response.statusText);
        }
      } else {
        console.log('Token já armazenado é o mais recente, não será enviado novamente.');
      }
    } catch (error) {
      console.error('Erro ao armazenar ou enviar o token:', error);
    }
  };

  public removeToken = async () => {
    try {
      await AsyncStorage.removeItem('pushToken');
      console.log('Token removido.');
    } catch (error) {
      console.error('Erro ao remover o token:', error);
    }
  };

  public renewToken = async () => {
    await this.removeToken(); // Remove o token antigo
    this.configure(); // Reconfigura para gerar e enviar um novo token
  };
}

export const pushNotificationService = new PushNotificationService();
