import {Day, getDateAfter, getFinalDate} from "@/lib/calendar/calendar";
import {useRef, useState} from "react";
import { View, Text, StyleSheet, Button, FlatList, ViewabilityConfig, useWindowDimensions } from "react-native";

import Calendar from "@/components/Calendar";

export default function Index() {
  const [date, setDate] = useState(new Date());
  const {width} = useWindowDimensions();

  const getPreviousMonth = (date: Date): Date => {
    return getDateAfter(date, -1 * Day * 30 + (getFinalDate(date) % 30) % 2);
  }

  const getNextMonth = (date: Date): Date => {
    return getDateAfter(date, Day * getFinalDate(date));
  }

  const [viewData, setViewData] = useState([getPreviousMonth(date), date, getNextMonth(date)])
  const flatListRef = useRef<FlatList<Date>>(null);

  const viewabilityConfig: ViewabilityConfig = {minimumViewTime: 300, itemVisiblePercentThreshold: 50, waitForInteraction: true};
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
            <Calendar date={item.item}/> 
            )}
        horizontal
        pagingEnabled
        style={styles.calendarList}
        keyExtractor={(item) => item.getFullYear().toString() + "-" + item.getMonth().toString()}
        contentContainerStyle={{width: "300%"}}
        onViewableItemsChanged={(i) => {
          const active_item = i.changed.find((v) => v.isViewable);

          if (!active_item || active_item.index == 1) {
            return; 
          }

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
      </View>

      );
}
