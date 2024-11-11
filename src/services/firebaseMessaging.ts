import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';

// Solicita permissão ao usuário para notificações
export async function requestUserPermission(): Promise<void> {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Permissão para notificações:', authStatus);
  } else {
    console.log('Permissão para notificações não concedida');
  }
}

// Obtém o token FCM do dispositivo
export async function getFCMToken(): Promise<string | undefined> {
  try {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Erro ao obter token FCM:', error);
    return undefined;
  }
}

// Listener para mensagens recebidas em primeiro plano
export function setupOnMessageListener(): void {
  messaging().onMessage(async (remoteMessage) => {
    console.log('Mensagem recebida em primeiro plano:', remoteMessage);
    Alert.alert(
      remoteMessage.notification?.title || 'Nova mensagem',
      remoteMessage.notification?.body || ''
    );
  });
}

// Listener para mensagens recebidas quando o app está em background
export function setupBackgroundMessageHandler(): void {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Mensagem recebida em background:', remoteMessage);
  });
}

// Listener para eventos de notificação clicada
export function setupNotificationOpenedListener(): void {
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log('Notificação clicada enquanto o app estava em background:', remoteMessage);
  });

  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log('Notificação que abriu o app:', remoteMessage);
      }
    });
}
