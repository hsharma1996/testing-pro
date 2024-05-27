$('select').selectpicker();
let loadContent = async (btn, page = 1) => {
    let res = await callServer(btn, '/tester/projects', SerializedArray({ type: window.content, page: page || 1, order: window.order }));
    if (res.error) {
        $("#projectsTabContent").html(res.data);
        return true;
    }
}
let cancelSlot = async (id, confirmation = false) => {
    if (!confirmation) {

    }
    let res = await callServer('', `/tester/slot/${id}?_method=delete`, SerializedArray({}));
    if (res.error) {
        loadContent();
        return true;
    }
}