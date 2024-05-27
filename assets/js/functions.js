$(document).ready(function () {

    $("body").not('.profile.btn').on("click", function (e) {
        $('.nofications-drop').removeClass('open')
        $('.will_drop').removeClass("show")
        $('.profile-drop').removeClass("open")
        $('#dateOptions').remove();
    })

    $(document).on("click", ".should_drop", function (e) {
        e.stopPropagation()
        $('.nofications-drop').removeClass('open')
        $('.profile-drop').removeClass("open")
        $('.will_drop').removeClass("show")
        $(this).siblings('.will_drop').addClass("show")
    })

    $(".notifications-btn").on("click", function (e) {
        e.preventDefault();
        e.stopPropagation()
        $('.will_drop').removeClass("show")
        $('.profile-drop').removeClass("open")
        $('.nofications-drop').addClass('open')
    })

    $(".profile.btn").on("click", function (e) {
        e.stopPropagation()
        $('.nofications-drop').removeClass('open')
        $('.will_drop').removeClass("show")
        $(this).siblings('.profile-drop').toggleClass("open")
    })

    $(".close_drop").on("click", function (e) {
        $('.will_drop').removeClass("show")
    })

    // $(".edit-profile").on("click", function () {
    //     $(".profile.view,.profile.edit").toggleClass('hide open').toggle();
    // })

    // $(".pcancel").on("click", function () {

    //     $(".content-wrap.edit").removeClass('open').fadeOut(0);
    //     $(".content-wrap.view").removeClass('hide').fadeIn(50);
    // })

    // $(".edit-account-details").on("click", function () {
    //     $(".tester-account-info.view").addClass('hide');
    //     $(".tester-account-info.edit").addClass('open').fadeIn();
    // })

    // $(".icancel, .isave").on("click", function () {
    //     $(".tester-account-info.edit").removeClass('open').fadeOut(0);
    //     $(".tester-account-info.view").removeClass('hide').fadeIn(50);
    // })

    // $(".modal-time-select").on("click", function () {
    //     $(".modal-time-select").removeClass('selected');
    //     $(this).addClass('selected');
    // })

    // $(".show-second-modal").on("click", function () {
    //     $(".custom-modal").removeClass('open');
    //     $('.project-modal-2').addClass('open');
    // })

    // $(".show-third-modal").on("click", function () {
    //     $(".custom-modal").removeClass('open');
    //     $('.project-modal-3').addClass('open');
    // })

    // $(".add-amount-btn").on("click", function () {
    //     $('.amount-modal').addClass('open');
    // })

    // $(".suspend-btn").on("click", function () {
    //     $(".suspend-modal").addClass('open');
    // })

    // $(".pause-proj").on("click", function () {
    //     $(".pause-modal").addClass('open');
    // })

    // $(".resume-proj").on("click", function () {
    //     $(".resume-modal").addClass('open');
    // })

    // $(".delete-proj").on("click", function () {
    //     $(".delete-modal").addClass('open');
    // })

    // $(".approve-proj").on("click", function () {
    //     $(".approve-modal").addClass('open');
    // })

    // $(".dispute-proj").on("click", function () {
    //     $(".dispute-modal").addClass('open');
    // })

    // $(".limit-btn").on("click", function () {
    //     $(".session-modal").addClass('open');
    // })

    // $(".set-inReview").on("click", function () {
    //     $(this).find('.status').text('In Review');
    //     $('.in-review').removeClass('in-review');
    // })

    // $(".fc-daygrid-day").click(
    //     function () {
    //         console.log('hello')
    //         var someText = "my dynamic text";
    //         var newDiv = $("<div>").append(someText).click(function () { alert("click!"); });
    //         $(this).append(newDiv);
    //     }
    // )

});
$(window).on('load', function () {
    $('.loader').fadeOut();
});
function alertit(msg, type = 'danger') {
    $('.col-xs-11.col-sm-4.alert.alert-danger.animated.fadeInDown').remove()
    $.notify({
        message: msg
    }, {
        type: type,
        timer: 3000,
        placement: {
            from: 'bottom',
            align: 'right'
        }
    });
}
