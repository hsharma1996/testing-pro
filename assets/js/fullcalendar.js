let picker = {};
if ($('#litepicker').length) {
    picker = new Litepicker({
        element: document.getElementById('litepicker'),
        singleMode: false,
        format: 'DD MMMM, YYYY',
        minDate: moment.tz(window.timezone).toDate(),
        allowRepick: false,
        setup: (picker) => {
            picker.on('selected', async (date1, date2) => {
                renderCalendar(true);
                let data = { start_date: moment(date1.dateInstance).format('YYYY-MM-DD HH:mm:ss'), end_date: moment(date2.dateInstance).format('YYYY-MM-DD HH:mm:ss') }
                setTimeout(() => {
                    $('.fc-day').each((i, ele) => {
                        let dateData = $(ele).data('date');
                        let start = date1.dateInstance, end = date2.dateInstance;
                        let flag = moment(dateData, 'YYYY-MM-DD').isBetween(moment(start), moment(end), undefined, '[]')
                        !flag ? $('.fc-day[data-date="' + moment(dateData).format("YYYY-MM-DD") + '"]').addClass("fc-day-other disabled") : $('.fc-day[data-date="' + moment(dateData).format("YYYY-MM-DD") + '"]').removeClass("fc-day-other disabled");
                    })
                }, 300);
                if ($('#litepicker').data('startdate') != data.start_date && $('#litepicker').data('enddate') != data.end_date && !window.update_datepicker) {
                    let res = await callServer('', window.url, SerializedArray(data));
                    if (res.error) {
                        window.litepickerStart = date1.dateInstance
                        window.litepickerEnd = date2.dateInstance
                    } else {
                        alertit(res.msg)
                        return true;
                    }

                }
                window.update_datepicker = false;
            })
        }
    });
}
const conf = {
    headerToolbar: {
        right: 'prev,next',
        left: 'title',
    },
    validRange: {},
    aspectRatio: 1.1,
    initialDate: new Date(),
    fixedWeekCount: true,
    selectable: true,
    selectMirror: true,
    // timeZone: window.timezone,
    dayCellDidMount: function () {
        if (picker.getStartDate()) {
            $('.fc-day').each((i, ele) => {
                let dateData = $(ele).data('date');
                let start = picker.getStartDate(), end = picker.getEndDate();
                start = start.dateInstance;
                end = end.dateInstance;
                let flag = moment(dateData, 'YYYY-MM-DD').isBetween(moment(start), moment(end), undefined, '[]')
                !flag ? $('.fc-day[data-date="' + moment(dateData).format("YYYY-MM-DD") + '"]').addClass("fc-day-other disabled") : $('.fc-day[data-date="' + moment(dateData).format("YYYY-MM-DD") + '"]').removeClass("fc-day-other disabled");
            })
        }
    },
    dateClick: function (info) {
        if (!moment.tz(info.date, window.timezone).isSameOrAfter(moment(), 'day') || $(info.dayEl).hasClass('fc-day-other')) {
            return false;
        }
        if (!picker.getStartDate()) {
            alertit('Please select project date range first');
            return false
        }
        $('#dateOptions').remove();
        let event = calendar.getEvents()
            .filter(n => moment(n.start, 'YYYY-MM-DD').isSame(moment(info.dateStr, 'YYYY-MM-DD'), 'day'))
            .map(n => n.extendedProps);
        let exclude = calendar.getEvents();
        exclude = exclude && exclude[0] ? exclude[0].extendedProps : [];
        let button = `<button class="btn" onClick="openPopup($(this),true)" data-date="${info.dateStr}">Edit <strong>all ${dayName[info.date.getDay()]}s</strong></button>`;
        if ((event[0] && !event[0].reoccurring && event[0].reoccurring_day) || (exclude && exclude.linkedDays && exclude.linkedDays.indexOf(info.dateStr, 'YYYY-MM-DD') != -1)) {
            button = `<button class="btn reset" onClick="resetToReoccuring($(this),true)" data-date="${info.dateStr}">Reset To Reoccurring </strong></button>`;
        }
        $(info.dayEl).append(`<div id='dateOptions'><button class="btn" data-date="${info.dateStr}" onClick="openPopup($(this))">Edit <strong>date(s)</strong></button>${button}</div>`)
    },
    selectAllow: function (info) {
        if (!moment(info.start).isSameOrAfter(moment(), 'day')) return false;
        return true;
    },
    eventDidMount: function ({ event }) {
        if (!moment(event.start).isSameOrAfter(moment().tz(window.timezone), 'day')) return true;
        let ele = $('.fc-day[data-date="' + moment(event.start).format("YYYY-MM-DD") + '"] .fc-daygrid-day-top')
        if (event.extendedProps.linkedDays.length) {
            for (let dates of event.extendedProps.linkedDays) {
                let emptyEle = $('.fc-day[data-date="' + dates + '"] .fc-daygrid-day-top')
                if (!emptyEle.length) return true;
                emptyEle.find('.fas').length || !event.extendedProps.reoccurring || !event.extendedProps.reoccurring_day || emptyEle.append("<a class='fc-daygrid-day-number'><i class='fas fa-calendar-week'></i></a>").addClass('d-flex justify-content-between');
            }
        }
        if (event.extendedProps.reoccurring) {
            ele.find('.fas').length || ele.append("<a class='fc-daygrid-day-number'><i class='fas fa-retweet'></i></a>").addClass('d-flex justify-content-between');
        } else if (event.extendedProps.reoccurring_day) {
            ele.find('.fas').length || ele.append("<a class='fc-daygrid-day-number'><i class='fas fa-calendar-week'></i></a>").addClass('d-flex justify-content-between');
        }
    },
    select: function (arg) {
    },
    eventClick: function (arg) {
    },
    displayEventEnd: true,
    eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    },
    editable: true,
    dayMaxEvents: true,
}
// moment.tz.guess();//
let eventifyData = (data) => {
    let events = new Array();
    for (let eventData of data) {
        if (!(eventData.slots && eventData.slots.length)) {
            continue;
        }
        if (!moment(eventData.slot_date, 'YYYY-MM-DD HH:mm:ss').isSameOrAfter(moment().tz(window.timezone), 'day')) {
            continue
        }
        for (let slots of eventData.slots) {
            let event = {
                id: slots.id,
                title: "",
                extendedProps: {
                    reoccurring: eventData.is_reoccurring,
                    reoccurring_day: eventData.reoccurring_day,
                    linkedDays: (data.filter(n =>
                        eventData.reoccurring_day &&
                        !n.slots.length && !n.is_reoccurring && moment(n.slot_date).day() == eventData.reoccurring_day).
                        map(e => { return moment.tz(e.slot_date, window.timezone).format("YYYY-MM-DD") })),
                },
                allDay: false,
                start: moment(`${moment(slots.slot_date, 'YYYY-MM-DD HH:mm:ss')
                    .format('YYYY-MM-DD')} ${slots.slot_start_time}`, 'YYYY-MM-DD HH:mm:ss')
                    .tz(window.timezone).toDate(),
                end: moment(`${moment(slots.slot_date, 'YYYY-MM-DD HH:mm:ss')
                    .format('YYYY-MM-DD')} ${slots.slot_end_time}`, 'YYYY-MM-DD HH:mm:ss')
                    .tz(window.timezone).toDate(),
                editable: false
            };
            events.push(event);
        }
    }
    conf.events = [];
    if (events.length) {
        conf.events = events;
    }
    renderCalendar()

}
let renderCalendar = (type = false) => {
    var calendarEl = document.getElementById('calendar');
    if (!calendarEl) return true;
    // calendar && calendar.destroy();
    setTimeout(() => {
        $('.fc-day .fas').parent('a').remove();
        calendar = new FullCalendar.Calendar(calendarEl, conf);
        calendar.render()
        window.litepickerStart && calendar.gotoDate(window.litepickerStart)
        window.update_datepicker && !type && resetLitePicker && resetLitePicker()
    }, 200)
}