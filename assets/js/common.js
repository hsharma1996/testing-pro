let Button = (btn, type) => {
    type ? btn.addClass('load').attr('disabled', 'disabled') : btn.removeClass('load').removeAttr('disabled')
}
let Input = (str, type = "name", ele = "input") => {
    return `${ele}[${type}='${str}']`;
}
let SerializedArray = (object) => {
    let data = new Array();
    Object.keys(object).forEach(element => {
        data.push({ name: element, value: object[element] })
    });
    return data;
}
let updateLength = (ele) => {
    if (ele.val().length < ele.attr('maxlength')) {
        ele.parent('div').find('span.length').show().html(`${ele.val().length}`);
    }
    else if (ele.val().length >= ele.attr('maxlength')) {
        ele.parent('div').find('span.length').show().html(ele.val().length);
    }
}
let updateRemaining = (ele) => {
    let left = 0, note = " characters remaining";
    if (ele.val().length < ele.attr('maxlength')) {
        left = parseInt(ele.attr('maxlength')) - ele.val().length;
        note = left == 1 ? " character remaining" : " characters remaining";
    }
    ele.parent('div').find('.remaining').show().html(`<span>${left}</span>${note}`);
}
$.fn.isValid = function () {
    var validate = true;
    this.each(function () {
        if (this.checkValidity() == false) {
            validate = false;
        }
    });
    return validate
};
function callServer(btn, url, data, method = "POST") {
    btn && Button(btn, true);
    window.token && data.push({ name: "token", "value": window.token })
    window.csrfToken && data.push({ name: "_csrf", "value": window.csrfToken })
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            method: method,
            dataType: 'json',
            async: 'true',
            data: data,
            success: function (response) {
                btn && Button(btn, false);
                if (response.error == 5) {
                    alertit(response.msg);
                    relogin((checkVar(response.data.error_cd) ? response.data.error_cd : "")); //will handle later
                } else {
                    resolve(response);
                }
            },
            error: function (jqXHR, exception) {
                btn && Button(btn, false);
                var msg = 'We cannot process your request at the moment, Please try again later.';
                console.log(jqXHR)
                // if (jqXHR.status === 0) {
                //     msg = "";
                // } else if (jqXHR.status == 404) {
                //     msg = window.error_message[3];
                // } else if (jqXHR.status == 500) {
                //     msg = window.error_message[3];
                // } else if (exception === 'parsererror') {
                //     msg = window.error_message[3];
                // } else if (exception === 'timeout') {
                //     msg = window.error_message[3];
                // } else if (exception === 'abort') {
                //     msg = window.error_message[3];
                // } else {
                //     msg = window.error_message[3];
                // }
                resolve({
                    error: 0,
                    msg: msg
                });
            }
        });
    });
}
function callServerWithFormdata(btn, url, data, method = "POST") {
    btn && Button(btn, true);
    window.token && data.append('token', window.token);
    window.csrfToken && data.append('_csrf', window.csrfToken);
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            method: method,
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            async: 'true',
            data: data,
            // xhr: function () {
            //     var myXhr = $.ajaxSettings.xhr();
            //     if (myXhr.upload) {
            //         myXhr.upload.addEventListener('progress', function (e) {
            //             var max = e.total;
            //             var current = e.loaded;
            //             var Percentage = (current * 100) / max;
            //             var percentComplete = Percentage;
            //             var percentVal = percentComplete + '%';
            //             setProgress("", percentComplete);
            //         });
            //     }
            //     return myXhr;
            // },
            success: function (response) {
                btn && Button(btn, false);
                if (response.error == 5) {
                    alertit(response.msg);
                    relogin((checkVar(response.data.error_cd) ? response.data.error_cd : ""));
                } else {
                    resolve(response);
                }
            },
            error: function (jqXHR, exception) {
                btn && Button(btn, false);
                var msg = 'We cannot process your request at the moment, Please try again later.';
                console.log(jqXHR)
                // if (jqXHR.status === 0) {
                //     msg = "";
                // } else if (jqXHR.status == 404) {
                //     msg = window.error_message[3];
                // } else if (jqXHR.status == 500) {
                //     msg = window.error_message[3];
                // } else if (exception === 'parsererror') {
                //     msg = window.error_message[3];
                // } else if (exception === 'timeout') {
                //     msg = window.error_message[3];
                // } else if (exception === 'abort') {
                //     msg = window.error_message[3];
                // } else {
                //     msg = window.error_message[3];
                // }
                resolve({
                    error: 0,
                    msg: msg
                });
            }
        });
    });
}
function checkFile(file) {
    if (!file.files || !file.files.length) {
        return false;
    }
    var fileType = file.files[0]["type"];
    var validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if ($.inArray(fileType, validImageTypes) < 0) {
        $(file).val('');
        alertit('Only Gif, JPEG and PNG files are supported')
        return false;
    }
    var fsize = file.files.item(0).size;
    var file = Math.round((fsize / 1024));
    if (file > (1024 * 500)) {
        return false;
    } else {
        return true;
    }
}
var printImage = function (input, target) {
    if ($(input)[0].files && $(input)[0].files.length) {
        if (!checkFile($(input)[0])) {
            return true;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            $(target).attr('data-src', $(target).attr('src')).attr('src', e.target.result);
        }
        reader.readAsDataURL($(input)[0].files[0]);
    }
}