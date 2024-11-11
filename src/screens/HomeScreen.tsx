import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Image,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Navbar from '../components/NavBar';
import Feed from '../components/Feed';

const BASE_URL = "https://cemear-b549eb196d7c.herokuapp.com";

const HomeScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePostSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const formData = new FormData();
      formData.append('titulo', title);
      formData.append('conteudo', content);

      if (image) {
        formData.append('image', {
          uri: image,
          type: 'image/jpeg',
          name: 'post.jpg',
        } as any);
      }

      const response = await axios.post(`${BASE_URL}/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Post criado:', response.data);
      setModalVisible(false);
      setTitle('');
      setContent('');
      setImage(null);
    } catch (error) {
      console.error('Erro ao enviar post:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
      <Feed />
      <View style={styles.footerButtons}>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="home-outline" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.floatingButtonContainer}>
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={32} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="heart-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Título"
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              placeholder="Digite sua postagem..."
              style={styles.textArea}
              value={content}
              onChangeText={setContent}
              multiline
            />
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              <Ionicons name="image-outline" size={24} color="black" />
              <Text>Anexar Imagem</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.previewImage} />}
            <Button title="Postar" onPress={handlePostSubmit} />
            <Button title="Cancelar" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    footerButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingVertical: 10,
      borderTopWidth: 1,
      borderColor: '#E0E0E0',
      backgroundColor: '#FFFFFF',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    floatingButtonContainer: {
      position: 'relative',
      bottom: 20,
    },
    floatingButton: {
      backgroundColor: '#0095ff',
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '90%',
      backgroundColor: '#FFF',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    input: {
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
      marginBottom: 10,
      padding: 10,
    },
    textArea: {
      width: '100%',
      height: 100,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      marginBottom: 10,
      padding: 10,
      textAlignVertical: 'top',
    },
    previewImage: {
      width: 100,
      height: 100,
      marginVertical: 10,
    },
    imagePicker: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
  });
  
export default HomeScreen;
