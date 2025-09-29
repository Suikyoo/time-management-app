import {Task} from "../task/task";
import { Day } from "../time/time";

export const month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const day_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface Page {
  year: number;
  month: number;
  days: number[];
  //how many values preceed the month on day 1 since day 1 probably isn't sunday 
  //so it's not gonna be the first value
  offset: number;

}

function is_leap(year: number) {
  if (year % 400 == 0) {
    return true
  }

  if (year % 4 == 0 && year % 100 != 0) {
    return true
  }

  return false

}

//get page from date
export function getPage(date: Date): Page {
  const page: Page = {year: date.getFullYear(), month: date.getMonth(), days: [], offset: 0};

  const first_day = new Date(page.year, page.month, 1);
  //get the first sunday of the month ( it's okay if it trespasses other months)
  const first_sunday = new Date(first_day.getTime() - (first_day.getDay() * Day));

  page.offset = 0;
  if (first_day.getMonth() != first_sunday.getMonth()) {
    page.offset = getFinalDate(first_sunday) - first_sunday.getDate() + 1;
  }
  page.days = Array.from({length: page.offset}, (_, i) => first_sunday.getDate() + i);

  page.days = page.days.concat(Array.from({length: getFinalDate(first_day)}, (_, i) => 1 + i))

  return page
  }

//get date from page
export function getDate(page: Page, day: number): Date {
  return new Date(page.year, page.month, day);

}

//get the final day of th month 0-31
//take note: month here starts at 0 count: 0-11
export function getFinalDate(date: Date): number {
  //february case
  if (date.getMonth() == 1) {
    if (is_leap(date.getFullYear())) {
      return 29;
    }
    return 28;
    
  }

  //all the other cases
  if ((date.getMonth() % 7) % 2 == 0) {
    return 31;
  }
  return 30;
}

//supports negative mili / date before
//this should be only in milli to account for edge values like december, then + month. I don't wanna worry about it
export function getDateAfter(date: Date, ms: number): Date {
  const new_date = new Date(date);
  return new Date(new_date.getTime() + ms);

}
