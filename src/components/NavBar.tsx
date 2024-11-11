import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { pushNotificationService } from '../services/PushNotificationService';

const Navbar: React.FC = () => {
  const handleNotificationPermission = async () => {
    try {
      PushNotificationIOS.checkPermissions((currentPermissions) => {
        if (currentPermissions.alert || currentPermissions.badge || currentPermissions.sound) {
          Alert.alert('Notificações', 'Permissões já concedidas. Renovando token...');
          pushNotificationService.renewToken(); // Renova o token e envia ao backend
        } else {
          PushNotificationIOS.requestPermissions({
            alert: true,
            badge: true,
            sound: true,
          }).then((permissions) => {
            if (permissions.alert || permissions.badge || permissions.sound) {
              console.log('Permissões concedidas:', permissions);
              pushNotificationService.configure();
              Alert.alert('Notificações', 'Permissões renovadas com sucesso!');
            } else {
              Alert.alert('Notificações', 'Permissão de notificações não concedida.');
            }
          });
        }
      });
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      Alert.alert('Erro', 'Não foi possível verificar ou solicitar permissões.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleNotificationPermission}>
        <Icon name="notifications" size={28} color="#0095ff" />
      </TouchableOpacity>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    height: 70,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
});

export default Navbar;
