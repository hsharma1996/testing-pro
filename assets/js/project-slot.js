let openPopup = async (ele, all = false) => {
    $('.calendar-table').text('');
    $(Input('type')).val(all);
    $(Input('date')).val(ele.data('date'));
    $(Input('project_id')).val($('#project_id').val());
    $('.calendar-modal').addClass('open');
    ele.parent('div').remove();
    let res = await getSlots(true);
    let appendEle = $('.time-wrap');
    appendEle.html('')
    let excluded = res.data.slots && res.data.slots.excluded ? res.data.slots.excluded : new Array();
    if (res.error == 1 && res.data.slots.slots && res.data.slots.slots.length) {
        for (let slots of res.data.slots.slots) {
            timeslotRow(appendEle, slots);
        }
    } else {
        timeslotRow(appendEle);
    }
    window.picker_start = picker.getStartDate().dateInstance
    window.picker_end = picker.getEndDate().dateInstance
    getAddButton();
    res.data.excluded = res.data.excluded || new Array();
    let selectedDate = moment(ele.data('date'), 'YYYY-MM-DD');
    window.selectedDates = new Array();
    window.selectedDates.push(ele.data('date'));
    generateCalendar(selectedDate, selectedDate, all, excluded);
    if (!$('.day.selected').length) {
        $(Input('date')).val(ele.data('date'));
        $(Input('project_id')).val($('#project_id').val());
        // $('.calendar-modal').removeClass('open');
        alertit(`The selected date(s) are not available for ${all ? "reoccurring slots" : "slots"}`);
    }
}
let getSelection = (type = 'start', date = "") => {
    let x = {
        slotInterval: 30,
        timeStart: "00:00",
        timeEnd: "23:59"
    };
    let startTime = moment(x.timeStart, "HH:mm");
    let endTime = moment(x.timeEnd, "HH:mm");
    let ele = `<select required ${type !== "start" && 'disabled'} class='selectpicker' size="5" onchange='updateSlot("${type}",$(this))' title="Time" name='${type}[]'>`;
    let isFirst = true;
    while (endTime > startTime) {
        let datePrint = startTime.format("LT");
        let dateValue = startTime.format("HH:mm");
        startTime.add(x.slotInterval, 'minutes');
        let isDisabled = (!(endTime > startTime) && type == "start") || (isFirst && type == 'end') ? "disabled" : "";
        ele += `<option ${moment(date, 'HH:mm:ss').format('HH:mm') == dateValue ? "selected" : ""} value="${dateValue}" ${isDisabled}>${datePrint}</option>`;
        isFirst = false;
    }
    ele += `</select>`;
    return ele;
}
let updateSlot = (type, ele) => {
    setTimeout(function () {
        $('.addSlot').focus().trigger('focus')
    }, 500)
    let slotInterval = $('#slotDuration').val();
    let date = moment(ele.val(), "HH:mm");
    type == 'start' ? date.add(slotInterval, 'minutes') : date.subtract(slotInterval, 'minutes');
    date = date.format('HH:mm');
    type = type == "start" ? "end" : "start";//inverting the type
    $(ele).closest('.form-grp').find(`select[name="${type}[]"]`).selectpicker('val', date);
    checkOverlapping();
}
let timeslotRow = (obj, data = {}) => {
    let ele = `<div class="time-row mb-3">`;
    ele += `<div class="form-grp">`
    ele += getSelection('start', data.slot_start_time)
    if (data) {
        ele += `<input type="hidden" name="id[]" value="${data.id ? data.id : ""}"/>`
    }
    ele += `<p><img src="/Designs/assets/images/icons/line.png" alt="line"></p>`
    ele += getSelection('end', data.slot_end_time)
    ele += `<button type="button" onclick="deleteSlots($(this),'${data.id ? data.id : ""}')" class="btn btn-icon">`
    ele += `<img src="/Designs/assets/images/icons/trash.png" alt="trash">`
    ele += `</button>`
    ele += `</div>`
    ele += `</div>`
    obj.append(ele);
    $('.selectpicker').selectpicker('refresh');

}
let getAddButton = () => {

    $('.time-row:first-child select').removeAttr('required');
    $('.time-row:not(:first-child) select').length && $('.time-row:not(:first-child) select').attr('required');
    if ($('.addSlot').length) {
        return true;
    }
    let ele = `<button  type="button" class="btn btn-icon addSlot" onclick="timeslotRow($('.time-wrap'))">`
    ele += `<img src="/Designs/assets/images/icons/plus-lgt.png" alt="plus button">`
    ele += `</button>`
    $('.time-row:first-child').append(ele);
}
let createSlots = async (e, form) => {
    e.preventDefault();
    if (checkOverlapping()) {
        return true;
    }
    form.find('select').removeAttr('disabled');
    let data = form.serializeArray();
    form.find('select').attr('disabled');
    let btn = form.find('button[type="submit"]');
    window.selectedDates && data.push({ name: "allSlots", value: window.selectedDates })
    let res = await callServer(btn, form.attr('action'), data);
    if (res.error) {
        resetSlots();
        res.data.all && eventifyData(res.data.all);
        return true;
    }
    alertit(res.msg);
}
let checkOverlapping = () => {
    if ($('.time-row').length > 1) {
        //overlapping dates
        let flag = false;
        $('.time-row:last-child .form-grp').removeClass('invalid');
        $('.overlappingSlots').hide();
        $('.time-row:not(:last-child)').each((i, ele) => {
            ele = $(ele);
            let start1 = $('.time-row:last-child select[name="start[]"]').val(), end1 = $('.time-row:last-child select[name="end[]"]').val(), start2 = ele.find('select[name="start[]"]').val(), end2 = ele.find('select[name="end[]"]').val();
            let iFlag = ((moment(start1, "HH:mm").format('x') < moment(end2, "HH:mm").format('x')) && (moment(start2, "HH:mm").format('x') < moment(end1, 'HH:mm').format('x')))
            flag = iFlag == true ? true : flag;
            if (iFlag) {
                $('.time-row:last-child .form-grp').addClass('invalid');
                $('.overlappingSlots').show();
            }
        });
        return flag;
    }
}
let getSlots = async (type = false) => {
    let form = $('#slotForm');
    let data = SerializedArray({ project_id: $('#project_id').val(), type: $(Input('type')).val(), date: $(Input('date')).val() });
    let btn = form.find('button[type="submit"]');
    let res = await callServer(btn, form.attr('action'), data, 'GET');
    if (res.data && !type) {
        eventifyData(res.data.all);
    } else {
        conf.events = {};
        renderCalendar()
    }
    return res;
}
getSlots();//initial call
let deleteSlots = async (btn, id) => {
    let form = $('#slotForm');
    if (id) {
        let data = SerializedArray({ project_id: $('#project_id').val(), type: $(Input('type')).val() });
        let res = await callServer(btn, `${form.attr('action')}/${id}?_method=delete`, data, 'POST');
        if (!res.error) {
            alertit(res.msg);
            return true;
        }
    }
    btn.parent('div').parent('div').remove();
    !$('.time-row').length && timeslotRow($('.time-wrap'));
    getAddButton();
    return true;
}
let resetSlots = () => {
    $('.custom-modal').removeClass('open');
    $('.overlappingSlots').hide();
    $('#slotForm input,#slotForm select').val('').trigger('reset')
    window.selectedDates = "";
    getSlots();
}
let resetToReoccuring = async (obj) => {
    let form = $('#slotForm');
    let res = await callServer('', `${form.attr('action')}/${obj.data('date')}?_method=PUT`, SerializedArray({ project_id: $('#project_id').val() }), 'POST');
    if (res.error) {
        getSlots();
        return true;
    }
    alertit(res.msg);
}
let addToSelect = (date, valid) => {
    if (valid || !moment(date.data('date'), 'YYYY-MM-DD').isBetween(window.litepickerStart, window.litepickerEnd, undefined, "[]")) {
        console.log('wrong Date');
    } else {
        if (window.selectedDates.indexOf(date.data('date')) != -1) {
            date.removeClass('selected')
            window.selectedDates = window.selectedDates.filter(n => n != date.data('date'))
        } else {
            date.addClass('selected')
            window.selectedDates.push(date.data('date'))
        }
    }
}