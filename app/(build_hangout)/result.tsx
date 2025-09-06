import ResultCard from '@/components/ResultCard';
import SendTextModal from '@/components/SendTextModal';
import { useHangoutBuilder } from '@/context/BuildHangoutContext';
import { useHangoutResults } from '@/hooks/useHangoutResults';
import Place from '@/types/Place';
import { buildText } from '@/utils/buildText';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Portal,
  Surface,
  Text,
  TouchableRipple,
  useTheme
} from 'react-native-paper';
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";

const CONTAINER_PADDING = 20;

export default function ResultScreen() {
  const theme = useTheme();
  const { hangoutData} = useHangoutBuilder();
  const [selectedResults, setSelectedResults] = useState<Place[]>([]);
  const [ModalVisible, setModalVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const recipients = hangoutData?.invitedContacts?.map(contact => contact.phoneNumber);

  const selectResult = (place: Place) => {
    const selectedResult = selectedResults.find(result => result.id === place.id);
    let copy = []
    if (selectedResult) {
      copy = selectedResults.filter(result => result.id !== place.id);
    } else {
      copy = [...selectedResults]
      copy.push(place);
    }
    setSelectedResults(copy);
  }

  const screenWidth = Dimensions.get('window').width;
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  const onPrev = () => {
    router.dismiss();
  }

  const {results, loading, error} = useHangoutResults(hangoutData);

  useEffect(() => {
    setMessage(buildText(hangoutData, selectedResults));
  }, [selectedResults.length])

  if (loading) {
    return (
      <View style={{
        ...styles.container, 
        backgroundColor: theme.colors.background, 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingHorizontal: 70
      }}>
        <ActivityIndicator animating={true} size='large' />
        <Text style={{
          textAlign: 'center',
          marginTop: 40
        }}>
          Just a moment while we find the best options for you…
        </Text>
      </View>
    )
  } else if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={{flex: 1, justifyContent: 'center', padding: 10}}>
          <Text variant="bodyLarge" style={{ textAlign: 'center' }}>
            {error}
          </Text>
        </View>
      </View>
    )
  } else if (screenWidth) {
    return (
      <View style={styles.container}>
        <Portal>
          <SendTextModal 
            visible={ModalVisible}
            setVisible={setModalVisible}
            message={message}
            recipients={recipients}
          />
        </Portal>
        <View style={{...styles.container, padding: CONTAINER_PADDING, backgroundColor: theme.colors.background}}>
          <View style={styles.carouselWrapper}>
            <Carousel
              ref={ref}
              width={screenWidth - (CONTAINER_PADDING * 2)}
              height={undefined}
              data={results}
              onProgressChange={progress}
              loop={false}
              renderItem={({item, index}) => (
                <TouchableRipple 
                  style={{
                    marginHorizontal: 10,
                    borderRadius: 30,
                    borderWidth: 2,
                    borderColor: selectedResults.find(result => result.id === item.id)
                      ? theme.colors.primary
                      : theme.colors.onBackground
                  }} 
                  onPress={() => selectResult(item)}
                >
                  <ResultCard key={`result_${index}`} place={item} />
                </TouchableRipple>
              )}
            />
      
            <Pagination.Basic
              progress={progress}
              data={results}
              dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 50 }}
              containerStyle={{ gap: 5, marginTop: 20 }}
              onPress={onPressPagination}
            />
          </View>
        </View>
          {
            selectedResults.length > 0 && (
              <Surface
                style={styles.bottomBanner}
              >
                <Text style={{flex: 1, marginRight: 18}}>
                  {selectedResults.length} Selected
                </Text>
                <Button
                  onPress={() => setModalVisible(true)}
                  mode='contained'
                  buttonColor={theme.colors.secondary}
                  textColor={theme.colors.onSecondary}
                  style={{borderRadius: 10}}
                >
                  CONTINUE
                </Button>
              </Surface>
            )
          }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carouselWrapper: {
    flex: 1, 
    width: '100%', 
    marginBottom: 100 
  },
  bottomBanner: {
    width: '100%', 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingTop: 15,
    paddingBottom: 50
  }
});