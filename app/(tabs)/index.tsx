import {Day, getDateAfter, getFinalDate} from "@/lib/calendar/calendar";
import {useState} from "react";
import { View, Text, StyleSheet, Button, FlatList } from "react-native";

import Calendar from "@/components/Calendar";

export default function Index() {
  const [date, setDate] = useState(new Date());


  return (
      <View>

        <FlatList 
        data={[
        getDateAfter(date, Day * 30 + (getFinalDate(date) % 30) % 2), 
        date, 
        getDateAfter(date, Day * getFinalDate(date))
        ]} 
        renderItem={item => (
            <Calendar date={item.item}/> 
            )}
        horizontal
        pagingEnabled
        style={styles.calendarList}
        />
      </View>

      );
}

const styles = StyleSheet.create({
calendarList: {

}
    })
