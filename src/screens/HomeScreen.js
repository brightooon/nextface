import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Welcome to NextFace AI</Title>
          <Paragraph style={styles.subtitle}>
            Advanced AI-powered facial analysis for plastic surgery consultation
          </Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.featureCard}>
        <Card.Content>
          <Title>Features</Title>
          <Paragraph>• Facial landmark detection</Paragraph>
          <Paragraph>• AI-powered analysis</Paragraph>
          <Paragraph>• Professional consultation support</Paragraph>
          <Paragraph>• Secure photo processing</Paragraph>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('PhotoUpload')}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        Start Analysis
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 20,
    elevation: 4,
  },
  featureCard: {
    marginBottom: 30,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#6200EE',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
  },
  button: {
    marginTop: 'auto',
    backgroundColor: '#6200EE',
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default HomeScreen;