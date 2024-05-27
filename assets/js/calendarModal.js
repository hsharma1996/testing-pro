var date = {},
  selectedDay, typeDay, excludeDate;

function generateCalendar(dateData, selected, type = false, exclude, isExplore = false) {
  startDate = dateData;
  date = startDate;
  excludeDate = exclude;
  selectedDay = selected;
  typeDay = type;
  let dateInstance = window.picker_start;

  let startDateInstance = moment(dateInstance).tz(window.timezone);
  dateInstance = window.picker_end;
  let endDateInstance = moment(dateInstance).tz(window.timezone);;
  startDateInstance.isSame(dateData, 'month') ? $('#left').unbind('click').addClass('disabled') : $('#left').unbind('click').bind('click', leftClick).removeClass('disabled'); //check if start can be marked
  endDateInstance.isSame(dateData, 'month') ? $('#right').unbind('click').addClass('disabled') : $('#right').unbind('click').bind('click', rightClick).removeClass('disabled'); //check if start can be marked
  let d = new Date(startDate.year(), startDate.month(), startDate.date());
  Date.prototype.monthDays = function () {
    var d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
    return d.getDate();
  };
  var details = {
    totalDays: d.monthDays(),
    weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  };
  var start = new Date(d.getFullYear(), d.getMonth()).getDay();
  var cal = [];
  var day = 1;
  for (var i = 0; i <= 5; i++) {
    cal.push(['<tr>']);
    for (var j = 0; j < 7; j++) {
      if (i === 0) {
        cal[i].push('<td class="day-text"><p>' + details.weekDays[j] + '</p></td>');
      } else if (day > details.totalDays) {
        cal[i].push('<td>&nbsp;</td>');
      } else {
        if (i === 1 && j < start) {
          cal[i].push('<td>&nbsp;</td>');
        } else {
          let todayDate = new Date(d.getFullYear(), d.getMonth(), day),
            dayDate = moment(todayDate).format('YYYY-MM-DD');
          let className = moment.tz(todayDate, window.timezone).isBetween(startDateInstance, endDateInstance, 'day', '[]') ?
            "" : "isDisabled",
            pClass = "";
          if (isExplore) {
            className = className ? className :
              (type ? (moment(todayDate).day() == selectedDay.day() ? "selected inRange" : "") :
                (moment(todayDate).isSame(selectedDay, 'day') ? "selected inRange" : ""));
            pClass = excludeDate.indexOf(moment(todayDate).format('YYYY-MM-DD HH:mm:ss')) != -1 &&
              moment(todayDate).isBetween(startDateInstance.format('YYYY-MM-DD'), endDateInstance.format('YYYY-MM-DD'), undefined, '[]') ?
              " hasSlots" : "";
            className += className ? "" : " inRange";
          } else {
            className = className ?
              className :
              (type ? (moment(todayDate).day() == selectedDay.day() &&
                moment(todayDate).tz(window.timezone).isSameOrAfter(moment().tz(window.timezone), 'day') &&
                excludeDate.indexOf(moment(todayDate).format('YYYY-MM-DD HH:mm:ss')) == -1 ?
                "selected inRange" : "") :
                (moment(todayDate).tz(window.timezone).isSame(selectedDay, 'day') ?
                  "selected inRange" : ""));
          }
          cal[i].push(`<td class="day ${className}" onclick="addToSelect($(this),${isExplore || type})" data-date="${dayDate}"><p class="${pClass}" data-date=""> ${day++} </p></td>`);
        }
      }
    }
    cal[i].push('</tr>');
  }
  cal = cal.reduce(function (a, b) {
    return a.concat(b);
  }, []).join('');
  $('.calendar-table').append(cal);
  $('#month').text(details.months[d.getMonth()]);
  $('#year').text(d.getFullYear());
  $('td.day').mouseover(function () {
    $(this).addClass('hover');
  }).mouseout(function () {
    $(this).removeClass('hover');
  });
}

function leftClick() {
  $('.calendar-table').text('');
  generateCalendar(date.clone().subtract('1', 'month').startOf('month'), selectedDay, typeDay, excludeDate);
};

function rightClick() {
  $('.calendar-table').html('<tr></tr>');
  generateCalendar(date.clone().add('1', 'month').startOf('month'), selectedDay, typeDay, excludeDate);
};