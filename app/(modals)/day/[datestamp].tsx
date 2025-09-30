import {useLocalSearchParams} from "expo-router";



export default function DayModal() {
  const {timestamp} = useLocalSearchParams<{timestamp: string}>();
  const date = new Date(timestamp);
  return (
    <View>
      
    </View>
  );
}
