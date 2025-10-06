import {dateIsEqual} from "@/lib/calendar/calendar";
import {useTaskList} from "@/lib/task/task";
import {Text, View} from "react-native";

interface Props {
  date: Date;
}

export default function Day({date}: Props) {
  const tasks = useTaskList(s => s.tasks).filter(t => dateIsEqual(t.date, date))
  return (
    <View>

    <View>
      <Text>Day</Text>
      <Text>{date.getDate()}</Text>
    </View>

    <View>
    {
      tasks.map(t => (
        <View>
        <Text>{t.title}</Text>
        </View>
      ))
    }
    </View>

    </View>
  );
}
