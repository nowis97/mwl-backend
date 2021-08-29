export function toDate(date:Date) :string {
  return  date.toISOString().split('T')[0];
}

export function nextDay(date:Date):Date{

  date.setDate(date.getDate() +1);
  return date;
}