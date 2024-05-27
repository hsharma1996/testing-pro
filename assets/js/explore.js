let projectData, start_project, end_project, dates, altSlots;
let addToSelect = () => { }
$(document).on('click', '.day:not(.isDisabled)', function () {
    $('.day.selected').removeClass('selected')
    $(this).addClass('selected');
    let data = altSlots.filter(n => moment(n.slot_date, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') == $(this).data('date'));
    $('.time-area .sub').html(moment($(this).data('date'), 'YYYY-MM-DD').format('dddd, MMMM DD'))
    if (data.length && data[0].slots.length) {
        $('.time-select-wrap').html('');
        let { slots } = data[0];
        for (let slot of slots) {
            $('.time-select-wrap').append(Slots(slot));
        }
    } else {
        $('.time-select-wrap').html('No Slots Available')
    }
});
let Slots = (data) => {
    let action = data.user_id ? "" : `onclick="$(this).find('p').toggleClass('selected')"`
    let classAdded = !data.user_id || "booked";
    let ele = `<div class="time-select ${classAdded}" ${action}>`
    ele += `<p class="modal-time-select">${data.start_time}</p>`
    ele += `<button class="btn show-second-modal" onClick="bookSlot($(this),${data.id})">Confirm</button>`
    ele += `</div>`
    return ele;
}
let bookSlot = async (btn, id, confirmation = false) => {
    if (!confirmation) {
        let res = await callServer(btn, `/tester/slot/${id}`, SerializedArray({ confirmation: false }), 'GET');
        if (res.error) {
            $('.project-modal-1,.project-modal-2').toggleClass('open');
            $('.project-modal-2 .project-info').html(res.data);
            $('.project-modal-2 button').data('id', id);
            return true;
        }
        alertit(res.msg)
        return true;
    }
    let res = await callServer(btn, `/tester/slot/${id}`, SerializedArray({ confirmation: true }), 'GET');
    if (res.error) {
        $('.project-modal-2').removeClass('open');
        $('.project-modal-3 .confirmation').html(res.data);
        $('.project-modal-3').addClass('open');
        loadContent();
        return true;
    }
    alertit(res.msg)
}
let loadContent = async (btn, page = 1) => {
    let form = $('#filters')
    let data = form.serializeArray();
    data.push({ name: "page", value: page })
    let res = await callServer(btn, '/tester/explore-projects', data);
    if (res.error) {
        $('#contentDiv').html(res.data)
        $('.selectpicker').selectpicker();
        return true;
    }
    alertit(res.msg);
}
let getProject = async (btn) => {
    let res = await callServer(btn, `/tester/project/${btn.data('id')}/book`, SerializedArray({}), 'GET');
    if (res.error) {
        let start = res.data.start_date
        let end = res.data.end_date
        $('#project-popup').html(res.html);
        $('.project-modal-1').addClass('open')
        return true;
    }
    alertit(res.msg);
}
let updateTimezone = async (select) => {
    let res = await callServer('', `/tester/update-timezone`, SerializedArray({ timezone: select.val() }), 'GET');
    if (res.error) {
        $('#button' + select.data('project')).trigger('click');
        $('#project-popup').html(res.html);
        $('.project-modal-1').addClass('open')
        return true;
    }
    alertit(res.msg);
}