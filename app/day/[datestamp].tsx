import {useTaskList} from "@/lib/task/task";
import {useLocalSearchParams} from "expo-router";
import {View, Text, StyleSheet} from "react-native";

export default function DayModal() {
  const {datestamp} = useLocalSearchParams<{datestamp: string}>();
  const date = new Date(datestamp);
  const styles = StyleSheet.create({
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
    }
  })
  const tasks = useTaskList(state => state.tasks)

  return (
    <View style={styles.container}>
      <View>
        <Text>{date.getDate()}</Text>
      </View>

      <View>
      <Text>Your tasks:</Text>
      {
        tasks.map((t) => (
          <View style={{backgroundColor: t.color}}>
            <Text>{t.title}</Text>
            <Text>{t.description}</Text>
          </View>
        ))
      }
      </View>
    </View>
  );
}
