import {getPage, month_names, day_names} from "@/lib/calendar/calendar";
import {Task, useTaskList} from "@/lib/task/task";
import { View, Text, StyleSheet } from "react-native";

interface CalendarProp {
  date: Date;
}

interface CalendarDayProp {
  day: number;
  tasks: Task[];
  active: boolean;
  
}
function CalendarDay({day, tasks, active}: CalendarDayProp) {
  return (
      <View style={[styles.item, active ? {outlineWidth: 1} : {outlineWidth: 0}]}>

      {tasks.map((t) => (
            <View style={[styles.tag, {backgroundColor: t.color}]} key={t.id}></View>
            ))}

      { active ? <Text style={{color: "#888888"}}>{day}</Text> : <Text>{day}</Text> }
      </View>
      )

}
export default function Calendar({date}: CalendarProp) {
  const page = getPage(date);
  const tasks = useTaskList(state => state.tasks);
  return (
    <View style={styles.container}>
      <View style={styles.nav}>
      <Text>{month_names[page.month]}</Text>
      </View>
      <View style={styles.calendar}>
      {
        day_names.map((v, index) => (
          <View key={index} style={styles.header}>
          <Text>{v.substring(0, 3)}</Text>
          </View>
        )
            )
      }
      {
        page.days.map((d, index) => {
            const s = tasks.filter((t) => t.date?.getMonth() == page.month);
            return (
              <CalendarDay key={index} day={d} tasks={s} active={index >= page.offset} />
              )}
            )

      }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      width: `${100/3}%`,
      justifyContent: "flex-start",
      alignItems: "center",

    },
    calendar: {
      width: "100%",
      display: "flex",
      flexWrap: "wrap",
      flexDirection: "row",
      alignItems: "center",

    },
    item: {
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: `${100/7}%`,
      height: 50,
      outlineWidth: 1,
      outlineOffset: -2,
      outlineColor: "#cccccc",
      borderRadius: 5, 
      boxSizing: "border-box",
      padding: 2,

    },

    header: {
      display: "flex",
      fontWeight: 800,
      fontSize: 200,
      justifyContent: "center",
      alignItems: "center",
      width: `${100/7}%`,
      height: 30,
      boxSizing: "border-box",
      padding: 2,
    },

    nav: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },

    tag: {
      width: 20,
      height: 20,
      borderRadius: 20,

    }


  });
 

