
//milliseconds

//I don't know why I'm sticking with millis. 
//I don't think anyone would plan their lives 
//down to the millisecond

//nevertheless, I'm betting on the fact that this module would 
//probably mingle with the Date interface 
//which has the getTime() method in milliseconds

//The way this is used is basically like Date.getTime() 
//but instead of January 1970, It'll just base it off 12:00AM
type Duration = number;

interface TimeStamp {
  //given a string "12:51 AM",
  hours: number;        //12
  minutes: number;      //51
  mod: number | null;   //AM
}



export const Second: Duration = 1000;
export const Minute: Duration = Second * 60;
export const Hour: Duration = Minute * 60; 
export const Day: Duration = Hour * 24;

export function getTimeStamp(s: string): TimeStamp {
  const res = /^(?<hours>\d{1,2}):(?<minutes>\d{1,2}) (?<mod>[AP]M)$/.exec(s);

  if (!res || !res.groups) {
    throw new Error(`${s} not in timestamp format`);
  }
  const { hours, minutes, mod } = res.groups;
  return {hours: Number(hours), minutes: Number(minutes), mod: mod == "AM" ? 0 : 1}

}
export function getDuration(t: TimeStamp): Duration {
  //damn
  return t.mod ? Hour * (12 * t.mod + (t.hours % 12)) + Minute * t.minutes : Hour * t.hours + Minute * t.minutes;
}

