let parent = $('.work-experience')
let total = 0;
let options = (type, value) => {
    let data = window[type];
    value = value ? value.split(',') : [];
    let options = "";
    for (let option of data.split(',')) {
        options += `<option ${value.indexOf(option) == -1 || "selected"} value="${option}">${option}</option>`;
    }
    return options;
}
let row = (work) => {
    total++;
    let ele = ``;
    ele += `<hr class="py-3">`;
    ele += `<div class="content-in work${work.id || total}Parent">`;
    ele += `<div class="content-body">`;
    if (work.id) {
        ele += `<div class="content-wrap work${work.id} view">`;
        ele += `<div class="content-header">`;
        ele += `<p>Work Experience #${total}</p>`;
        ele += `<div>`;
        ele += total != 1 && isSame && work.id ? `<button class="btn edit-profile" onclick="deleteWork($(this),'${work.id}')">Delete</button> | ` : ""
        ele += isSame && work.id ? `<button class="btn edit-profile" onclick="edit('work${work.id}',true)">Edit</button>` : ``;
        ele += `</div>`;
        ele += `</div >`;
        ele += `<div class="wrapper">`;
        ele += `<div class="data-wrap">`;
        ele += `<h3>Company</h3>`;
        ele += `<p>${work.company_name || ''}</p>`;
        ele += `</div >`;
        ele += `<div class="data-wrap">`;
        ele += `<h3>Industry Background</h3>`;
        ele += `<p>${work.industry_background || ''}</p>`;
        ele += `</div>`;
        ele += `<div class="data-wrap">`;
        ele += `<h3>Company Size</h3>`;
        ele += `<p>${work.company_size || ''}</p>`
        ele += `</div>`;
        ele += `<div class="data-wrap">`;
        ele += `<h3>Job Function</h3>`;
        ele += work.job_functions ? tagify(work.job_functions) : ""
        ele += `</div>`;
        ele += `</div >`;
        ele += `</div >`;
    }
    ele += `<div class="content-wrap edit work${work.id} ${work.id || 'open'}" ${work.id ? "style = 'display:none'" : "style = 'display:block'"}>`;
    ele += `<div class="content-header">`;
    ele += `<p>Work Experience #${total}</p>`;
    ele += `</div >`;
    ele += `<form id="workExperience" action="${route}" method="POST"
            onsubmit="publishWorkExperience(event,$(this))">`;
    ele += `<div class="wrapper">`;
    ele += `<div class="data-wrap">`;
    ele += `<h3>Company Name</h3>`;
    // ele += `<p class="small"><em>Select all industries that you have worked in (employed and/or self-employed)</em></p>`;
    ele += `<div class="form-grp">`;
    ele += work.id ? `<input type="hidden" name="id[0]" value="${work.id}">` : ""
    ele += `<input required value='${work.company_name || ""}' data-value='${work.company_name || ""}' maxlength="254" name="company_name[0]" placeholder="Company's name" type="text" class="form-control project">`;
    ele += `</div>`;
    ele += `</div>`;
    ele += `<div class="data-wrap">`;
    ele += `<h3>Industry Background</h3>`;
    // ele += `<p class="small"><em>Select all industries that you have worked in (employed and/or self-employed)</em></p>`;
    ele += `<div class="form-grp">`;
    ele += `<select required name="industry_background[0]" data-value="${work.industry_background}" data-live-search="true" class="selectpicker" title="Select Industry">`
    ele += options('industry_background', work.industry_background)
    ele += `</select>`;
    ele += `</div>`;
    ele += `</div>`;
    ele += `<div class="data-wrap">`;
    ele += `<h3>Company Size</h3>`;
    // ele += `<p class="small"><em>Select all company sizes that you have worked in (employed and/or self-employed)</em></p>`;
    ele += `<div class="form-grp">`;
    ele += `<select required name="company_size[0]" data-value="${work.company_size}" data-live-search="true" class="selectpicker" title="Select Company SIze">`;
    ele += options('company_size', work.company_size);
    ele += `</select>`;
    ele += `</div>`;
    ele += `</div>`;
    ele += `<div class="data-wrap">`;
    ele += `<h3>Job Function</h3>`;
    // ele += `<p class="small"><em>Select all job functions that you have worked in (employed and/or self-employed)</em></p>`;
    ele += `<div class="form-grp">`;
    ele += `<select required name="job_functions[0][]" data-value="${work.job_functions}" data-live-search="true" class="selectpicker" title="Select Job Functions" multiple>`;
    ele += options('job_functions', work.job_functions);
    ele += `</select>`;
    ele += `</div>`
    ele += `</div>`
    ele += `</div>`
    ele += `<div class="btns text-right">`
    ele += `<button type="button" onclick="` + (work.id ? "edit(`work" + work.id + "`, false)" : "$(`.work" + total + "Parent`).prev('hr').remove();$(`.work" + total + "Parent`).remove()") + `" class="btn pcancel">Cancel</button>`;
    ele += `<button class="btn psave blue">Save Changes</button>`
    ele += `</div>`
    ele += `</form>`
    ele += `</div>`
    ele += `</div>`
    ele += `</div>`
    return ele;
}
let tagify = (data) => {
    let ele = `<div class="tag-wrap">`;
    console.log(data.split(','));
    for (let tag of data.split(',')) {
        ele += `<div class="tag">`;
        ele += `<p>${tag}</p>`
        ele += `</div>`
    }
    ele += `</div>`
    return ele;
}
let removeWork = (btn) => {
    $(`#wordExperience${btn.data('number')}`).remove();
    $('.workBoxes:last-child .addWorkExperience').show();
    $('.workBoxes').each((i, ele) => {
        total = i + 1;
        if (total == 1) {
            $(ele).find('.btn-delete').hide();
        }
        $(ele).find('input').attr('name', `company_name[${i}]`);
        $(ele).find('select:first-child').attr('name', `industry_background[${i}]`);
        $(ele).find('select:nth-child(2)').attr('name', `company_size[${i}]`);
        $(ele).find('select:last-child').attr('name', `job_functions[${i}]`);
        $(ele).find('h2 .count').html(`#${total}`);
        $(ele).attr('id', `wordExperience${total}`);
        $(ele).data('number', total);
        $(ele).find('.btn-delete,.addWorkExperience').data('number', total);
    })
}
let publishWorkExperience = async (e, form) => {
    e.preventDefault();
    let data = form.serializeArray();
    let btn = form.find('button[type="submit"]');
    // console.log('data data'); return true;
    let res = await callServer(btn, form.attr('action'), data);
    if (res.error) {
        total = 0;
        works = res.data;
        parent.html('');
        rows();
        return true;
    }
    alertit(res.msg);
}
let deleteWork = async (btn, id, confirmation = false) => {
    if (!confirmation) {
        $('.custom-modal').addClass('open').find('button[type="submit"]').data('id', id)
        return true;
    }
    let res = await callServer(btn, `${route}?_method=delete`, SerializedArray({ id: id }));
    if (res.error) {
        total = 0;
        works = res.data;
        $('.custom-modal').removeClass('open').find('button[type="submit"]').data('id', '')
        parent.html('');
        rows();
        return true;
    }
    alertit(res.msg);
}
let edit = (id, type) => {
    if (type) {
        $(`.${id}.view`).hide().addClass('hide').removeClass('open');
        $(`.${id}.edit`).show().addClass('open').removeClass('hide');
    } else {
        $(`.${id}.edit`).hide().addClass('hide').removeClass('open');
        $(`.${id}.view`).show().addClass('open').removeClass('hide');
        $(`.${id}.edit input`).each((i, ele) => {
            $(ele).data('value') && $(ele).val($(ele).data('value'))
        })
        $(`.${id}.edit select`).each((i, ele) => {
            $(ele).data('value') && $(ele).selectpicker('val', '').selectpicker('val', $(ele).data('value').split(','));
        })
    }
}
let updateLinkedIN = async (e, form) => {
    e.preventDefault();
    if (!/(ftp|http|https):\/\/?(?:www\.)?linkedin.com(\w+:{0,1}\w*@)?(\S+)(:([0-9])+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test($(Input('linkedin_url')).val())) {
        alertit("Please enter a valid linkedin URL")
        return true;
    }
    let data = form.serializeArray();
    let btn = form.find('button[type="submit"]');
    let res = await callServer(btn, form.attr('action'), data);
    if (res.error) {
        $(Input('linkedin_url')).data('value', $(Input('linkedin_url')).val());
        $('.linkedinURL').html($(Input('linkedin_url')).val()).attr('href', $(Input('linkedin_url')).val());
        $(".linkeinButton").click()
        return true;
    }
    alertit(res.msg);
}
let rows = () => {
    works.map(n => parent.append(row(n)))
    // parent.append(row);
    $('.selectpicker').selectpicker('refresh');
}
rows()