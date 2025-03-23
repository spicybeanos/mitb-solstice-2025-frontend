

export function displayDateTime(date:Date){
    let ispm = date.getHours() > 12;
    return `${ispm?date.getHours()-12:date.getHours()}:${date.getMinutes()} ${ispm?"PM":"AM"}, ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
}