var moment = require('jalali-moment');
let Time = {}
Time.fullDate = () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    let fulldate = `${year}-${month}-${day}`;
    return moment(fulldate, 'YYYY-MM-DD').locale('fa').format('YYYY-MM-DD');
},
Time.fullTime = () => {
    let date = new Date().toLocaleString("en-US", {timeZone: "Asia/Tehran"});
    date = new Date(date);
    let hours = date.getHours();
    let min = date.getMinutes()+1;
    let sec = date.getSeconds();
    let fulltime = `${hours}:${min}:${sec}`;
    return fulltime;
}
module.exports = Time;