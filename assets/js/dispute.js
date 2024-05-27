let UpdateStatus = async (btn, id) => {
    let res = await callServer(btn, `/admin/dispute/${id}/status-update`, SerializedArray({}), 'GET');
    if (res.error) {
        btn.find('p').html(res.data.text);
        res.data.status == "settled" && btn.removeAttr('onclick');
        res.data.status == "review" && location.reload();
        return true;
    }
}
$('#updateDispute').submit(async function (e) {
    e.preventDefault();
    let res = await callServer($(this).find('button'), `/admin/dispute/${$(this).data('id')}?_method=put`, $(this).serializeArray(), 'POST');
    res.error == 1 && location.reload();
    if (res.error == 0) {
        alertit(res.msg);
    }
})
