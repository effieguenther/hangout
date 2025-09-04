function getOrdinalSuffix(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export const getReadableDate = (dateObject) => {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date(dateObject.dateString);
  const dayOfWeek = dayNames[date.getUTCDay()];
  const dayOfMonth = date.getUTCDate();
  const daySuffix = getOrdinalSuffix(dayOfMonth);

  let periods = [];
  if (dateObject.morning) {
    periods.push("morning");
  }
  if (dateObject.afternoon) {
    periods.push("afternoon");
  }
  if (dateObject.evening) {
    periods.push("evening");
  }
  
  const periodString = periods.join('/');
  
  return `${dayOfWeek} the ${dayOfMonth}${daySuffix} ${periodString}`;

}