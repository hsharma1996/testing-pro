let parent = $('.work-experience')
let total = 0;
let options = (type) => {
    let data = window[type];
    let options = "";
    for (let option of data.split(',')) {
        options += `<option value="${option}">${option}</option>`;
    }
    return options;
}
let row = () => {
    total++;
    let ele = `<div class="bord py-4 workBoxes" data-number = "${total}" id="wordExperience${total}">`;
    ele += `<div class="d-flex align-items-center justify-content-between">`;
    ele += `<h2 class="inner_title pb-3 nomarg">Work Experience <span class="count">#${total}</span></h2>`;
    if (total > 1) {
        ele += `<button data-number = "${total}" type="button" onclick="removeWork($(this))" class="btn btn-custom btn-delete">Delete</button>`;
    }
    ele += `</div>`;
    ele += `<div class="form-grp">`;
    ele += `<label class="pb-3" for="companyName">`;
    ele += `<p>Company Name</p>`;
    ele += `</label>`;
    ele += `<input required maxlength="254" name="company_name[${total}]" type="text" class="form-control">`;
    ele += `</div>`;
    ele += `<div class="form-grp">`
    ele += `<label class="pb-3" for="industryBackground">`
    ele += `<p>Industry Background</p>`;
    ele += `</label>`;
    ele += `<select required name="industry_background[${total}]" data-live-search="true" class="selectpicker" title="Select Industry">`
    ele += options('industry_background')
    ele += `</select>`;
    ele += `</div>`;
    ele += `<div class="form-grp">`;
    ele += `<label class="pb-3" for="companySize">`;
    ele += `<p>Company Size</p>`;
    ele += `</label>`;
    ele += `<select required name="company_size[${total}]" data-live-search="true" class="selectpicker" title="Select Company Size">`;
    ele += options('company_size');
    ele += `</select>`;
    ele += `</div>`;
    ele += `<div class="form-grp">`;
    ele += `<label class="pb-3" for="jobFunctions">`;
    ele += `<p>Job Functions</p>`;
    ele += `</label>`;
    ele += `<select required name="job_functions[${total}][]" data-live-search="true" class="selectpicker" title="Select Job Functions" multiple>`;
    ele += options('job_functions');
    ele += `</select>`;
    ele += `</div>`
    ele += `<div class="text-right">`
    ele += `<button data-add="true" type="button" data-id="${total}" onclick="$('#workExperience').data('add-row',true);$('form#workExperience').submit()" class="btn addWorkExperience"><i class="fas fa-plus pr-2"></i> Add Work Experience</button>`;
    ele += `</div>`
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
        $(ele).find('.form-grp > input').attr('name', `company_name[${i}]`);
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
    if (form.data('add-row') == true) {
        form.data('add-row', false);
        if ($(".work-experience input,.work-experience select").isValid()) {
            $('.addWorkExperience').hide();
            rows();
        } else {
            alertit('Please fill all the fields before adding new section');
        }
        return true;
    }
    if (!/(ftp|http|https):\/\/?(?:www\.)?linkedin.com(\w+:{0,1}\w*@)?(\S+)(:([0-9])+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test($(Input('url')).val())) {
        alertit("Please enter a valid linkedin URL")
        return true;
    }
    let data = form.serializeArray();
    let btn = form.find('button[type="submit"]');
    // console.log('data data'); return true;
    let res = await callServer(btn, form.attr('action'), data);
    btn.removeClass('load').removeAttr('disabled');
    if (res.error) {
        window.location.href = "/tester";
        return true;
    }
    alertit(res.msg);
}
let rows = () => {
    parent.append(row);
    $('.selectpicker').selectpicker('refresh');
}
rows()