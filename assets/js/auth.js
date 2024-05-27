let initRound = true;
let sendOTP = async (e, form) => {
    e.preventDefault();
    let btn = form.find('button[type="submit"]');
    let res = await callServer(btn, form.attr('action'), form.serializeArray());
    if (res.error) {
        $('#verifyOTPForm')[0].reset();
        $('#Part1').addClass('d-none');
        $('#Part2').removeClass('d-none');
        $('#otpSentMessage').html(res.msg)
        !initRound && alertit(res.data.msg, 'success')
        initRound = false;
        return true;
    }
    $('#Part2').addClass('d-none');
    $('#Part1').removeClass('d-none');
    alertit(res.msg);
}
let signup = async (e, form) => {
    e.preventDefault();
    let otp = "";
    $('.otpField').map((i, n) => { otp += $(n).val(); });
    $(Input('otp')).val(otp)
    let data = [...form.serializeArray(), ...$('#signupForm').serializeArray()];
    let btn = form.find('button[type="submit"]');
    let res = await callServer(btn, form.attr('action'), data);
    if (res.error) {
        window.location.href = res.data.route;
        return true;
    }
    alertit(res.msg);
}
let resetPassword = async (e, form) => {
    e.preventDefault();
    let otp = "";
    $('.otpField').map((i, n) => { otp += $(n).val(); });
    $(Input('otp')).val(otp)
    let data = [...form.serializeArray(), ...$('#forgetPasswordForm').serializeArray()];
    let btn = form.find('button[type="submit"]');
    let res = await callServer(btn, form.attr('action'), data);
    if (res.error) {
        window.location.href = res.data.route;
        return true;
    }
    alertit(res.msg);
}
let updatePassword = async (e, form) => {
    e.preventDefault();
    let data = form.serializeArray();
    let btn = form.find('button[type="submit"]');

    let res = await callServer(btn, form.attr('action'), data);
    if (res.error) {
        window.location.href = res.data.route;
        return true;
    }
    alertit(res.msg);
}
let login = async (e, form) => {
    e.preventDefault();
    $('.accountBanned').remove();
    let data = form.serializeArray();
    let btn = form.find('button[type="submit"]');
    let res = await callServer(btn, form.attr('action'), data);
    console.log(res);
    if (res.error == 1) {
        window.location.href = res.data.route;
        return true;
    } else if (res.error == 4) {
        $('.lbox').prepend(`<div class="accountBanned alert alert-info">${res.msg}</div>`)
        return true;
    }
    alertit(res.msg);
}
let goBackToSignup = () => {
    initRound = true;
    $('#Part1,#Part2').toggleClass('d-none');
    $('#verifyOTPForm')[0].reset();
}
//control OTP fields
$('.otpField').focus(function () { $(this).val('') }).keydown(function (e) {
    if (e.keyCode == 8) {
        console.log($(this).prev('.otpField').length)
        $(this).val() ? $(this).val('') : ($(this).prev('.otpField').length && $(this).prev('.otpField').focus());
    }
    $(this).val() && e.preventDefault();
})
let clickEvent = (first, last) => {
    if (first.value.length) {
        document.getElementById(last).focus();
    }
}
//User profile function 
let updateProfile = async (e, form) => {
    e.preventDefault();
    if ($('#image')[0].files.length && !checkFile($('#image')[0])) {
        return true;
    }
    let btn = form.find('button[type="submit"]');
    let otp = "";
    $('.otpField').map((i, n) => { otp += $(n).val(); });
    $(Input('otp')).val(otp)
    let data = form.serializeArray();
    let formData = new FormData();
    for (i of data) {
        formData.append(i.name, i.value);
    }
    if ($('#image')[0].files) {
        formData.append('profile_pic', $('#image')[0].files[0]);
    }
    let res = await callServerWithFormdata(btn, form.attr('action'), formData);
    if (res.error == 1) {
        alertit(res.msg, 'success')
        $('.pause-modal').removeClass('open')
        return true;
    }
    if (res.error == 2) {
        $('.pause-modal').addClass('open')
        $('#otpSentMessage').html(res.msg)
        !initRound && alertit(res.data.msg, 'success')
        initRound = false;
        return true;
    }
    alertit(res.msg);
}
//paymentDetailsUpdate
let paymentDetailsUpdate = async (e, form) => {
    e.preventDefault();
    let data = form.serializeArray();
    let btn = form.find('button[type="submit"]');
    let res = await callServer(btn, form.attr('action'), data);
    if (res.error) {
        alertit(res.msg, 'success')
        return true;
    }
    alertit(res.msg);
}