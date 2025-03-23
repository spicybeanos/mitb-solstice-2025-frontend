

export function displayDateTime(date: Date) {
    return `${displayTime(date)}, ${displayDate(date)}`
}
export function displayTime(date: Date) {
    let ispm = date.getHours() > 12;
    return `${ispm ? date.getHours() - 12 : date.getHours()}${date.getMinutes() == 0 ? "" : ":" + date.getMinutes()} ${ispm ? "PM" : "AM"}`
}
export function displayDate(date: Date) {
    let ispm = date.getHours() > 12;
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
}