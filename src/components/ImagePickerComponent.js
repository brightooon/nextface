import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

const ImagePickerComponent = ({ onImageSelected, disabled = false }) => {
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera roll permissions to upload photos.'
      );
      return false;
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    if (disabled) return;
    
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && onImageSelected) {
      onImageSelected(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    if (disabled) return;
    
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera permissions to take photos.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && onImageSelected) {
      onImageSelected(result.assets[0]);
    }
  };

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Title>Select Photo</Title>
        <Paragraph style={styles.description}>
          Choose a clear, well-lit photo of your face for analysis
        </Paragraph>
        
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={pickImageFromGallery}
            style={styles.button}
            icon="image"
            disabled={disabled}
          >
            Gallery
          </Button>
          
          <Button
            mode="outlined"
            onPress={takePhoto}
            style={styles.button}
            icon="camera"
            disabled={disabled}
          >
            Camera
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    elevation: 4,
  },
  description: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default ImagePickerComponent;