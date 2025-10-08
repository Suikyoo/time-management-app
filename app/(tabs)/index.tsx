import {getDateAfter, getFinalDate} from "@/lib/calendar/calendar";
import { Day } from "@/lib/time/time";
import {useEffect, useRef, useState} from "react";
import { FlatList, ScrollView, ViewabilityConfig, ViewToken } from "react-native";

import DayView from "@/components/DayView";
import Calendar from "@/components/Calendar";
import TaskPalette from "@/components/TaskPalette";
import {useColorScheme} from "nativewind";
import {ThemedView} from "@/components/ThemedComponents";
import {styles} from "@/lib/style/style";

export default function Index() {
  const [date, setDate] = useState(new Date());
  const {colorScheme} = useColorScheme();

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

  const paginate = (i: {viewableItems: ViewToken<Date>[], changed: ViewToken<Date>[]}) => {
    const active_item = i.changed.find((v) => v.isViewable);

    if (!active_item || active_item.index == 1) {
      return; 
    }

    clearTimeout(toggleScrollTimeout.current);
    setCalendarScroll(false);
    toggleScrollTimeout.current = setTimeout(() => setCalendarScroll(true), viewabilityConfig.minimumViewTime);

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

  }

  return (
    <ThemedView className="h-screen bg-zinc-100 dark:bg-zinc-950">
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedView className="flex-1 flex-col justify-start p-[20px] box-border h-[120vh]">

        <DayView date={date} className="p-4 bg-white rounded-lg my-safe dark:bg-zinc-900 box-border" style={styles.shadow}/>
        <ThemedView className="overflow-y-hidden h-[380px] bg-white rounded-lg dark:bg-zinc-900" style={styles.shadow}>
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
          keyExtractor={(item) => item.getFullYear().toString() + "-" + item.getMonth().toString()}
          contentContainerStyle={{width: "300%"}}
          disableIntervalMomentum
          onViewableItemsChanged={paginate}
          viewabilityConfig={viewabilityConfig}
          showsHorizontalScrollIndicator={false}
          />
        </ThemedView>

        <TaskPalette className="w-full my-5 bg-white rounded-lg dark:bg-zinc-900"/>
        </ThemedView>
      </ScrollView>
    </ThemedView>
      );
}
