import weekDayMap from "./weekdaymap";

export function orderColumnAsc(a, b, by) {
    
  if (by === "date") {
      console.log("entrou");
    return new Date(a.date) - new Date(b.date);
  }

  if (by === "weekDay") {
      console.log("weekday");
      console.log(weekDayMap[a.week_day])
    return weekDayMap[a.week_day] - weekDayMap[b.week_day]
  }

  if(by === 'value'){
      console.log("entrou");
    return a.value - b.value
  }

}
export function orderColumnDesc(a, b, by) {
  if (by === "date") {
    return new Date(b.date) - new Date(a.date);
  }

  if (by === "weekDay") {
    return weekDayMap[b.week_day] - weekDayMap[a.week_day]
  }

  if(by==='value'){
    return b.value - a.value
  }
}
