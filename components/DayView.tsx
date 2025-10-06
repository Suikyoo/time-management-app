import {dateIsEqual, month_names} from "@/lib/calendar/calendar";
import {useTaskList} from "@/lib/task/task";
import {ThemedText, ThemedView} from "./ThemedComponents";
import {ViewProps} from "react-native";
import {useColorScheme} from "nativewind";
import {styles} from "@/lib/style/style";

interface Props extends ViewProps{
  date: Date;
  className?: string;
}

export default function DayView({date, className, ...props}: Props) {
  const {colorScheme} = useColorScheme();
  const tasks = useTaskList(s => s.tasks).filter(t => dateIsEqual(t.date, date))
  const defaultStyle = "flex flex-row justify-stretch"
  return (
    <ThemedView className={`${defaultStyle} ${className || ""}`} {...props}>

    <ThemedView className="grow-3 aspect-square w-[60%] box-border p-5">
      <ThemedView 
      className="items-center justify-start w-full h-full bg-zinc-100 dark:bg-zinc-600 rounded-2xl" 
      style={styles.shadow}
      >
        <ThemedText className="text-xl italic grow-1">{`${month_names[date.getMonth()]} ${date.getFullYear()}`}</ThemedText>

        <ThemedView className="flex items-center justify-center h-[60%] rounded-2xl border-4 border-white aspect-square">
          <ThemedText className="text-5xl font-bold ">{date.getDate()}</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>

    <ThemedView className="h-full p-5 grow-3 box-border">
    {
      tasks.map(t => (
        <ThemedView className="px-5 my-1 rounded-full" style={[styles.shadow, {backgroundColor: t.color}]}>
        <ThemedText>{t.title}</ThemedText>
        </ThemedView>
      ))
    }
    </ThemedView>

    </ThemedView>
  );
}
