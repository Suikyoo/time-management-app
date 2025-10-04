
//milliseconds

//I don't know why I'm sticking with millis. 
//I don't think anyone would plan their lives 
//down to the millisecond

//nevertheless, I'm betting on the fact that this module would 
//probably mingle with the Date interface 
//which has the getTime() method in milliseconds

//The way this is used is basically like Date.getTime() 
//but instead of January 1970, It'll just base it off 12:00AM
export type Duration = number;

export interface TimeStamp {
  //given a string "12:51 AM",
  hours: number;        //12
  minutes: number;      //51
  mod: number | null;   //AM
}

export const Second: Duration = 1000;
export const Minute: Duration = Second * 60;
export const Hour: Duration = Minute * 60; 
export const Day: Duration = Hour * 24;

//hour: 00 min: 00 mod: null
function getMilitary(t: TimeStamp): TimeStamp {
  if (t.mod === null) {
    throw new Error("timestamp already has a null mod (AM/PM)");
  }

  const new_t: TimeStamp = {...t};
  new_t.hours = t.hours%12 + (12 * t.mod)
  new_t.mod = null;
  return new_t;

}

//hour: 12 min: 00 mod: 0 or AM (default return timestamp for every other functions
function getStandard(t: TimeStamp): TimeStamp {
  if (t.mod !== null) {
    throw new Error("timestamp already has AM/PM");
  }
  const new_t: TimeStamp = {...t};
  new_t.mod = Math.floor(t.hours/12);
  new_t.hours = t.hours % 12 ;
  new_t.hours = new_t.hours == 0 ? 12 : new_t.hours; 
  return new_t;
}

export function getTimeStampfromString(s: string): TimeStamp {
  const res = /^(?<hours>\d{1,2}):(?<minutes>\d{1,2}) (?<mod>[AP]M)$/.exec(s);

  if (!res || !res.groups) {
    throw new Error(`${s} not in timestamp format`);
  }
  const { hours, minutes, mod } = res.groups;
  return {hours: Number(hours), minutes: Number(minutes), mod: mod == "AM" ? 0 : 1}

}

//number of ms that passed since 12:00 AM
export function getTimeStamp(d: Duration): TimeStamp {
  const t: TimeStamp = {hours: 0, minutes: 0, mod: null}
  t.hours = Math.floor(d / Hour);
  t.minutes = d % Hour;
  return getStandard(t);

}

export function getDuration(t: TimeStamp): Duration {
  //damn
  return t.mod !== null ? Hour * (12 * t.mod + (t.hours % 12)) + Minute * t.minutes : Hour * t.hours + Minute * t.minutes;
}
export function timeStampAfter(t: TimeStamp, d: Duration): TimeStamp {
  const ms = getDuration(t) + d;
  return getTimeStamp(ms);

}

export function timeStampToString(t: TimeStamp): string {
  if (t.mod !== null) {
    return `${t.hours}:${t.minutes} ${t.mod ? "PM" : "AM"}`;
  }
  return `${t.hours}:${t.minutes}`;
}
