
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


export const Second: Duration = 1000;
export const Minute: Duration = Second * 60;
export const Hour: Duration = Minute * 60; 
export const Day: Duration = Hour * 24;


export function getDuration(s: string): Duration {

}
