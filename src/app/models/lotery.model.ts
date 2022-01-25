export interface Lotery {
    code?: string;
    name?: string;    
    dayOfWeek?: number;
    dayOfWeekException?: number;
    checked?;
    prize?;
    hourClose?: number;
    minuteClose?: number;
}