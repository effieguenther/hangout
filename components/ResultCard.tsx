import { Place } from '@/types/place';
import { StyleSheet, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';

interface ResultCardProps {
  place: Place;
}

const ResultCard: React.FC<ResultCardProps> = ({ place }) => {
  return (
    <Surface style={styles.card}>
      <View style={styles.titleContainer}>
        <Text variant='headlineSmall'>
          {place.displayName.text}
        </Text>
      </View>
      <Text>
        {place.editorialSummary?.text}
      </Text>
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1
  },
  titleContainer: {
    flexDirection: 'row'
  }
});

export default ResultCard;