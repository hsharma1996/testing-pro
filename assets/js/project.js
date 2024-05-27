var calendar;
let getTagsSuggestion = async (e, val) => {
    $(Input('proxy')).val(tagify.value.map(n => n.value).join())//updating for validation
    let res = await callServer('', "/tags", SerializedArray({ search: e.detail.value }), "GET");
    tagify.settings.whitelist.length = 0; // reset current whitelist
    tagify.loading(true)
    tagify.settings.whitelist.push(...res.map(n => n.value), ...tagify.value)
    tagify
        .loading(false)
        .dropdown.show.call(tagify, e.detail.value);
}
$('select').selectpicker();
input1 = document.querySelector('input[name=tags]'),
    // init Tagify script on the above inputs
    tagify = new Tagify(input1, {
        // placeholder: "Please start typing to see the suggestions",
        whitelist: [""],
        blacklist: ["fuck", "shit", 'slut', 'whore'],
        maxTags: 3,
        pattern: /^[A-Za-z0-9-]*$/,
        backspace: "edit",
        keepInvalidTags: false,
        required: true
    });
tagify.on('input', getTagsSuggestion);
tagify.on('add', () => { $(Input('proxy')).val(tagify.value.map(n => n.value).join()) });
let dayName = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")

//Phase 2
let getTesterCount = async () => {
    let res = await callServer('', "/company/testers/tester-count", $('#phase2').serializeArray(), "GET");
    let testers = res.data || parseInt(Math.random() * 15);//random number if no tester
    $('.tester-count-start').html(testers);
    $('.tester-count-end').html((testers + parseInt(Math.random() * (testers + 10))));
}
$('#phase2 .selectpicker').on('change', getTesterCount);
getTesterCount();
//phase 4
let perSessionBudget = () => {
    let amount = $(`${Input('hourly_budget')}:checked`).val();
    let time = $(`${Input('duration_of_session')}:checked`).val();
    if (!amount || !time) {
        $('.perSessionBudget').parent('h4').hide();
        return true;
    }
    let amountPerMinute = amount / 60;
    $('.perSessionBudget').parent('h4').show();
    $('.perSessionBudget').html(`$${time * amountPerMinute} per session`)
}
let removeUnpaid = async (btn, id) => {
    let res = await callServer(btn, `/company/projects/remove-unpaid-slots/${id}`, SerializedArray({}), 'GET');
    if (res.error) {
        btn.parent('div').remove();
    }
}
$('.change-budget input[type=radio]').change(perSessionBudget);
