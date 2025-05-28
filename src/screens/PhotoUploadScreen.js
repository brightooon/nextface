import React, { useState } from 'react';
import { View, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { Button, Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import PhotoUploadService from '../services/PhotoUploadService';

const PhotoUploadScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const takePhoto = async () => {
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

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const uploadAndAnalyze = async () => {
    if (!selectedImage) {
      Alert.alert('No Image Selected', 'Please select an image first.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await PhotoUploadService.uploadAndAnalyze(selectedImage);
      setIsLoading(false);
      navigation.navigate('Result', { analysisResult: result, image: selectedImage });
    } catch (error) {
      setIsLoading(false);
      Alert.alert(
        'Analysis Failed',
        'Failed to analyze the image. Please try again.'
      );
      console.error('Upload error:', error);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.instructionCard}>
        <Card.Content>
          <Title>Photo Guidelines</Title>
          <Paragraph>• Use good lighting</Paragraph>
          <Paragraph>• Face the camera directly</Paragraph>
          <Paragraph>• Remove glasses if possible</Paragraph>
          <Paragraph>• Keep hair away from face</Paragraph>
          <Paragraph>• Use neutral expression</Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={pickImageFromGallery}
          style={styles.button}
          icon="image"
        >
          Choose from Gallery
        </Button>
        
        <Button
          mode="outlined"
          onPress={takePhoto}
          style={styles.button}
          icon="camera"
        >
          Take Photo
        </Button>
      </View>

      {selectedImage && (
        <Card style={styles.imageCard}>
          <Card.Content>
            <Title>Selected Image</Title>
            <Image source={{ uri: selectedImage.uri }} style={styles.image} />
            <View style={styles.imageActions}>
              <Button
                mode="outlined"
                onPress={clearImage}
                style={styles.actionButton}
              >
                Clear
              </Button>
              <Button
                mode="contained"
                onPress={uploadAndAnalyze}
                style={[styles.actionButton, styles.analyzeButton]}
                disabled={isLoading}
              >
                {isLoading ? 'Analyzing...' : 'Analyze'}
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200EE" />
          <Paragraph style={styles.loadingText}>
            Analyzing your photo with AI...
          </Paragraph>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  instructionCard: {
    marginBottom: 20,
    elevation: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  imageCard: {
    marginBottom: 20,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginVertical: 10,
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  analyzeButton: {
    backgroundColor: '#6200EE',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
  },
});

export default PhotoUploadScreen;