import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Card, Title, Paragraph } from 'react-native-paper';

const LoadingComponent = ({ 
  message = "Processing...", 
  submessage = "Please wait while we analyze your photo",
  color = "#6200EE" 
}) => {
  return (
    <Card style={styles.container}>
      <Card.Content style={styles.content}>
        <ActivityIndicator size="large" color={color} style={styles.spinner} />
        <Title style={styles.title}>{message}</Title>
        <Paragraph style={styles.subtitle}>{submessage}</Paragraph>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    elevation: 4,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  spinner: {
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
  },
});

export default LoadingComponent;