import {getPage, month_names, day_names} from "@/lib/calendar/calendar";
import {Task, useTaskList, useTaskTarget} from "@/lib/task/task";
import {useEffect, useState} from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";

interface CalendarProp {
  date: Date;
  active: boolean;
}

interface CalendarDayProp {
  day: number;
  tasks: Task[];
  active: boolean;

}

function CalendarDay({day, tasks, active}: CalendarDayProp) {
  return (
    <>

      <FlatList 
      data={tasks} 
      keyExtractor={t => t.id + (t.date ? t.date.getTime().toString() : "")} 
      renderItem={i => (
        <View style={[styles.tag, {backgroundColor: i.item.color}]} ></View>
      )}
      />
      { active ? <Text style={{color: "#888888"}}>{day}</Text> : <Text>{day}</Text> }
    </>
  )

}
export default function Calendar({date, active}: CalendarProp) {
  const page = getPage(date);

  const addTask = useTaskList(state => state.createTask);
  const deleteTask = useTaskList(state => state.deleteTask);

  const target = useTaskTarget(state => state.task);

  const press = (tasks: Task[], newDate: Date) => {
    if (!target) {
      return
    }
    if (tasks.find(t => t.id === target.id)) {
      console.log("del")
      deleteTask(target.id);
    }
    else {
      console.log("add")
      addTask({...target, date: newDate})
    }

  }
  const [proxyTaskList, setProxyTaskList] = useState<Task[]>([])

  useEffect(() => {
    if (active) {
      const unsubscribe = useTaskList.subscribe((curr, _) => {setProxyTaskList(curr.tasks)});
      return unsubscribe;
    }
  }, [active]);

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
        const new_date = new Date(date.getUTCFullYear(), date.getUTCMonth(), d);
        const s = proxyTaskList.filter((t) => (new_date.toISOString().slice(10) === t.date?.toISOString().slice(10)));
        return (
          <TouchableOpacity 
          style={[styles.item, index >= page.offset ? {outlineWidth: 1} : {outlineWidth: 0}]} 
          onPress={() => press(s, new_date)}
          key={index}
          >
            <CalendarDay day={d} tasks={s} active={index >= page.offset} />
          </TouchableOpacity>
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


