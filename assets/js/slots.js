$('select').selectpicker();
let loadContent = async (btn, page = 1) => {
    let res = await callServer(btn, '/company/testers/load', SerializedArray({ type: window.content, year: $('#year').val(), month: $('#month').val(), page: page || 1, order: window.order }), 'GET');
    if (res.error) {
        $("#slots").html(res.data);
        return true;
    }
}
let cancelSlot = async (id, confirmation, btn = "") => {
    if (!confirmation) {
        $('.chead h1').html('Cancel Session');
        $('.chead p').html('Are you sure you want to cancel this session?');
        $('.approve-modal').addClass('open').find('button[type="submit"]').attr('onclick', `cancelSlot(${id},true,$(this))`);
        return true;
    }
    let res = await callServer(btn, '/company/testers/status-update', SerializedArray({ type: 'cancel', id: id }), 'GET');
    if (res.error) {
        $('.open').removeClass('open')
        if ($('.custom_pagination').length) {
            $(`#slot${id}`).remove();
        } else {
            loadContent('');
        }
        return true
    }
    alertit(res.msg);
}
let approveSlot = async (id, confirmation, btn = "") => {
    if (!confirmation) {
        $('.chead h1').html('Approve Session');
        $('.chead p').html('Are you sure you want approve this session?');
        $('.approve-modal').addClass('open').find('button[type="submit"]').attr('onclick', `approveSlot(${id},true,$(this))`);
        return true;
    }
    let res = await callServer(btn, '/company/testers/status-update', SerializedArray({ type: 'approve', id: id }), 'GET');
    if (res.error) {
        $('.approve-modal').removeClass('open')
        if ($('.custom_pagination').length) {
            $(`#slot${id}`).remove();
        } else {
            loadContent('');
        }
        return true;
    }
    alertit(res.msg);
}
let disputeSlot = async (id, confirmation) => {
    let form = $('#disputeForm')
    if (!confirmation) {
        form.data('id', id);
        $(Input('slot_id')).val(id);
        $('.dispute-modal').addClass('open');
        $('.dispute-modal').addClass('open').find('button[type="submit"]').attr('onclick', `disputeSlot(${id},true)`);
        return true;
    }
    let btn = form.find('button[type="submit"]')
    let res = await callServer(btn, '/dispute', form.serializeArray());
    if (res.error) {
        $(`#slot${id}`).remove();
        $('.custom-modal').removeClass('open')
        loadContent('');
        return true;
    }
    alertit(res.msg);
}