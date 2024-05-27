let loadContent = async (btn, page = 1) => {
    let res = await callServer(btn, `/company/projects/load/${window.content}`, SerializedArray({ page: page, order: window.order }), 'GET');
    if (res.error) {
        $("#projectsTabContent").html(res.data);
        // history.pushState({}, "", `/company/projects/${window.content}/show`);
        return true;
    }
    alertit(res.msg)
}
let deleteRow = async (id, confirmation) => {
    if (!confirmation) {
        $('.delete-modal').addClass('open');
        $('.delete-modal button[type="submit"]').data('id', id);
        return true;
    }
    let res = await callServer('', `/company/projects/${id}?_method=delete`, SerializedArray({}), 'POST');
    if (res.error) {
        $('.delete-modal').removeClass('open');
        loadContent("");
        return true;
    }
    alertit(res.msg)
}
let updateStatus = async (status, id, confirmation) => {
    if (!confirmation) {
        $(`.${status}-modal`).addClass('open');
        $(`.${status}-modal button[type='submit']`).attr('onclick', `updateStatus('${status}',${id},true)`)
        return true;
    }
    let res = await callServer('', `/company/projects/update-status`, SerializedArray({ status: status, id: id }));
    if (res.error) {
        $(`.${status}-modal`).removeClass('open');
        if ($('.custom_pagination').length) {
            $(`#project${id}`).remove();
        } else {
            loadContent('');
        }
        return true;
    }
    alertit(res.msg)
}