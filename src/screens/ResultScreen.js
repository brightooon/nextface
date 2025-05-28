import React from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, Divider } from 'react-native-paper';

const ResultScreen = ({ route, navigation }) => {
  const { analysisResult, image } = route.params;

  const handleNewAnalysis = () => {
    navigation.navigate('PhotoUpload');
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.imageCard}>
        <Card.Content>
          <Title>Analyzed Image</Title>
          <Image source={{ uri: image.uri }} style={styles.image} />
        </Card.Content>
      </Card>

      <Card style={styles.resultCard}>
        <Card.Content>
          <Title>Analysis Results</Title>
          <Divider style={styles.divider} />
          
          {analysisResult?.landmarks && (
            <View style={styles.section}>
              <Paragraph style={styles.sectionTitle}>Facial Landmarks Detected:</Paragraph>
              <Paragraph>{analysisResult.landmarks.length} key points identified</Paragraph>
            </View>
          )}

          {analysisResult?.symmetry && (
            <View style={styles.section}>
              <Paragraph style={styles.sectionTitle}>Facial Symmetry:</Paragraph>
              <Paragraph>Score: {analysisResult.symmetry.score}%</Paragraph>
              <Paragraph>Status: {analysisResult.symmetry.assessment}</Paragraph>
            </View>
          )}

          {analysisResult?.features && (
            <View style={styles.section}>
              <Paragraph style={styles.sectionTitle}>Feature Analysis:</Paragraph>
              {Object.entries(analysisResult.features).map(([feature, data]) => (
                <Paragraph key={feature}>
                  {feature}: {data.measurement} ({data.assessment})
                </Paragraph>
              ))}
            </View>
          )}

          {analysisResult?.recommendations && (
            <View style={styles.section}>
              <Paragraph style={styles.sectionTitle}>AI Recommendations:</Paragraph>
              {analysisResult.recommendations.map((rec, index) => (
                <Paragraph key={index}>• {rec}</Paragraph>
              ))}
            </View>
          )}

          {analysisResult?.confidence && (
            <View style={styles.section}>
              <Paragraph style={styles.sectionTitle}>Analysis Confidence:</Paragraph>
              <Paragraph>{analysisResult.confidence}%</Paragraph>
            </View>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.disclaimerCard}>
        <Card.Content>
          <Title style={styles.disclaimerTitle}>Important Notice</Title>
          <Paragraph style={styles.disclaimerText}>
            This analysis is for informational purposes only and should not replace professional medical consultation. 
            Please consult with a qualified plastic surgeon for personalized advice.
          </Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={handleNewAnalysis}
          style={styles.button}
        >
          New Analysis
        </Button>
        <Button
          mode="contained"
          onPress={handleGoHome}
          style={[styles.button, styles.homeButton]}
        >
          Home
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  imageCard: {
    marginBottom: 20,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginTop: 10,
  },
  resultCard: {
    marginBottom: 20,
    elevation: 4,
  },
  disclaimerCard: {
    marginBottom: 20,
    elevation: 4,
    backgroundColor: '#fff3cd',
  },
  disclaimerTitle: {
    color: '#856404',
  },
  disclaimerText: {
    color: '#856404',
    fontStyle: 'italic',
  },
  divider: {
    marginVertical: 10,
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#6200EE',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  homeButton: {
    backgroundColor: '#6200EE',
  },
});

export default ResultScreen;