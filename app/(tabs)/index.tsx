import {getDateAfter, getFinalDate} from "@/lib/calendar/calendar";
import { Day } from "@/lib/time/time";
import {useEffect, useRef, useState} from "react";
import { View, Text, StyleSheet, Button, FlatList, ViewabilityConfig } from "react-native";

import Calendar from "@/components/Calendar";
import TaskPalette from "@/components/TaskPalette";


export default function Index() {
  const [date, setDate] = useState(new Date());

  const [calendarWidth, setCalendarWidth] = useState(0);
  const [calendarScroll, setCalendarScroll] = useState(true);

  const toggleScrollTimeout = useRef(0);

  const getPreviousMonth = (date: Date): Date => { return getDateAfter(date, -1 * Day * 30 + (getFinalDate(date) % 30) % 2); }

  const getNextMonth = (date: Date): Date => {
    return getDateAfter(date, Day * getFinalDate(date));
  }

  const [viewData, setViewData] = useState([getPreviousMonth(date), date, getNextMonth(date)])
  const flatListRef = useRef<FlatList<Date>>(null);

  const viewabilityConfig: ViewabilityConfig = {minimumViewTime: 100, itemVisiblePercentThreshold: 90, waitForInteraction: true};

  const styles = StyleSheet.create({
    container: {
      boxSizing: "border-box",
      padding: 20,

    },
    calendarList: {
      width: "100%",

    }
  })

  return (
    <View style={styles.container}>
      <FlatList 
      ref={flatListRef}
      data={viewData} 
      renderItem={item => (
        <Calendar date={item.item} active={item.index==1}/> 
      )}
      horizontal
      pagingEnabled
      initialScrollIndex={1}
      scrollEnabled={calendarScroll}
      getItemLayout={(_, index) => ({length: calendarWidth, offset: calendarWidth * index, index})}
      onLayout={(e) => {
        e.currentTarget.measure((_, __, width) => {setCalendarWidth(width)})
      }}
      style={styles.calendarList}
      keyExtractor={(item) => item.getFullYear().toString() + "-" + item.getMonth().toString()}
      contentContainerStyle={{width: "300%"}}
      disableIntervalMomentum
      onViewableItemsChanged={(i) => {
        const active_item = i.changed.find((v) => v.isViewable);

        if (!active_item || active_item.index == 1) {
          return; 
        }

        clearTimeout(toggleScrollTimeout.current);
        setCalendarScroll(false);
        toggleScrollTimeout.current = setTimeout(() => setCalendarScroll(true), viewabilityConfig.minimumViewTime);

        //getItemLayout={(_, index) => ({length: calendarWidth, offset: calendarWidth * index, index})}
        //onLayout={(e) => {
        //e.currentTarget.measure((_, __, width) => {setCalendarWidth(width)})
        //}}
        if (active_item.index == 0) {
          //-----------------------------------------------used to be viewData[0]
          setViewData([getPreviousMonth(active_item.item), active_item.item, viewData[1]])
        }
        else if (active_item.index == 2) {
          setViewData([viewData[1], active_item.item, getNextMonth(active_item.item)])
        }

        requestAnimationFrame(() => {
          flatListRef.current?.scrollToIndex({index: 1, animated: false});
        })

      }}
      viewabilityConfig={viewabilityConfig}
      />

      <TaskPalette/>
    </View>

      );
}
