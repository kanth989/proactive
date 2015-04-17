var sliderHeight = "0px";
var slidersHeight = "0px";

jQuery(document).ready(function () {
    jQuery('.datetimes ul').each(function () {
            var current = jQuery(this);
            current.attr("box_h", current.height() + 15);
        }
    );


    jQuery(".datetimes ul").css("height", sliderHeight);
    jQuery(".datetimes .recurra ul").css("height", slidersHeight);
    jQuery(".timehide").hide();
    jQuery(".datetimes .rounded-plus").click(function (event) {
        event.preventDefault(), openSlider()
    })

});

function openSlider() {
    var open_height = jQuery(".datetimes ul").attr("box_h") + "px";
    jQuery(".timehide").show();
    jQuery(".datetimes ul").stop().animate({"height": open_height}, {duration: "slow"});
    jQuery(".datetimes .recurra ul").stop().animate({"height": open_height, "paddingTop": 20}, {duration: "slow"});
    jQuery(".datetimes .rounded-plus").click(function () {
        closeSlider()
    }).addClass('rounded-minus')
}
function closeSlider() {
    jQuery(".datetimes ul").stop().animate({"height": sliderHeight}, {duration: "slow"});
    jQuery(".timehide").hide();
    jQuery(".datetimes .recurra ul").stop().animate({"height": slidersHeight, "paddingTop": 0}, {duration: "slow"});
    jQuery(".datetimes .rounded-plus").click(function () {
        openSlider()
    }).removeClass('rounded-minus')
}

jQuery(document).ready(function () {
	jQuery("input[id='registrant.email']").blur(function(){
        this.value= trim(this.value);
    });
});

var detailHeight = "35px";

jQuery(document).ready(function () {
    jQuery('.custo-details p').each(function () {
            var current = jQuery(this);
            current.attr("box_h", current.height());
        }
    );


    jQuery(".custo-details p").css("height", detailHeight);
    jQuery(".custo-details .rounded-plus").click(function (event) {
        event.preventDefault(), openSliders()
    })

});

function openSliders() {
    var open_heights = jQuery(".custo-details p").attr("box_h") + "px";
    jQuery(".custo-details p").stop().animate({"height": open_heights}, {duration: "slow"});
    jQuery(".custo-details .rounded-plus").click(function () {
        closeSliders()
    }).addClass('rounded-minus')
}
function closeSliders() {
    jQuery(".custo-details p").stop().animate({"height": detailHeight}, {duration: "slow"});
    jQuery(".custo-details .rounded-plus").click(function () {
        openSliders()
    }).removeClass('rounded-minus')
}


var instructHeight = "55px";

jQuery(document).ready(function () {
    jQuery('.instrucs').each(function () {
            var current = jQuery(this);
            current.attr("box_h", current.height());
        }
    );


    jQuery(".instrucs").css("height", instructHeight);
    jQuery(".instrucs .rounded-plus").click(function (event) {
        event.preventDefault(), openSlideris()
    })

});

function openSlideris() {
    var open_heightis = jQuery(".instrucs").attr("box_h") + "px";
    jQuery(".instrucs").stop().animate({"height": open_heightis}, {duration: "slow"});
    jQuery(".instrucs .rounded-plus").click(function () {
        closeSlideris()
    }).addClass('rounded-minus')
}
function closeSlideris() {
    jQuery(".instrucs").stop().animate({"height": instructHeight}, {duration: "slow"});
    jQuery(".instrucs .rounded-plus").click(function () {
        openSlideris()
    }).removeClass('rounded-minus')
}


var instructoHeight = "22px";

jQuery(document).ready(function () {
    jQuery('#catalog-header .instrucs').each(function () {
            var current = jQuery(this);
            current.attr("box_h", current.height());
        }
    );


    jQuery("#catalog-header .instrucs").css("maxHeight", instructoHeight);
    jQuery("#catalog-header .instrucs .rounded-plus").click(function (event) {
        event.preventDefault(), openSliderisf()
    })

});

function openSliderisf() {
    var open_heightis = jQuery("#catalog-header .instrucs").attr("box_h") + "px";
    jQuery("#catalog-header .instrucs").addClass("showit").stop().animate({"maxHeight": "100000px"}, {duration: "slow"});
    jQuery("#catalog-header .instrucs .rounded-plus").click(function () {
        closeSliderisf()
    }).addClass('rounded-minus')
}
function closeSliderisf() {
    jQuery("#catalog-header .instrucs").removeClass("showit").stop().animate({"maxHeight": instructoHeight}, {duration: "slow"});
    jQuery("#catalog-header .instrucs .rounded-plus").click(function () {
        openSliderisf()
    }).removeClass('rounded-minus')
}

jQuery(document).ready(function () {
    jQuery(".expandDescription").click(function (event) {
        event.preventDefault(), jQuery(this).parent().parent().toggleClass("expadi")
    })

});


jQuery(document).ready(function () {
    jQuery('.clickbox').click(function (e) {
            e.preventDefault();
            jQuery(".discountedprice").addClass('openpricer');
        }
    );

    jQuery(document).ready(function () {
        var url = window.location.href;
        if (jQuery("body").attr("id") === "registrationConfirmation" || jQuery("body").attr("id") === "registration") {
            if (url.search("cancel") !== -1 && url.search("registration") === -1 && url.search("confirmation") === -1) {
                jQuery("#myModal-cancel").modal("show");
            }
            if (url.search("refundModal") !== -1) {
                jQuery("#myModal-also").modal("show");
            }
            if (url.search("dateTimeExpanded") !== -1 && url.search("registration") !== -1) {
                jQuery(".rounded-plus").click();
            }
        }
    });

    jQuery(document).ready(function () {
        if (jQuery("body").attr("id") == "registration") {
            var url = window.location.href;
            if (url.search("dateTimeExpanded") !== -1) {
                jQuery(".rounded-plus").click();
            }
        }
    });

    jQuery(document).ready(function () {
        if (jQuery("body").attr("id") == "cancelRegistration" || jQuery("body").attr("id") == "registrationCanceled" || jQuery("body").attr("id") == "paymentReceipt") {
            jQuery(".settings").remove();
        }
        if (jQuery("body").attr("id") == "catalog" && window.location.href.indexOf("embed") !== -1) {
            jQuery(".toes").remove();
        }
    });

    jQuery(document).ready(function () {
        if (jQuery("body").attr("id") == "backupNumbers") {
            var selected = jQuery("#backupNumber").val();
            jQuery("#altNumbers-" + selected).show();

            jQuery("#backupNumber").change(function () {
                var selected = jQuery(this).val();
                jQuery("div.altNumbers").hide();
                jQuery("#altNumbers-" + selected).show();
            });
        }
    });


    jQuery(document).ready(function () {
        jQuery(".sleepertext .top-plus").toggle(
            function () {
                jQuery(this).addClass('rounded-minus');
                jQuery(".sleepertext").addClass('longer');
            },
            function () {
                jQuery(this).removeClass('rounded-minus');
                jQuery(".sleepertext").removeClass('longer');
            }
        );
    });


    jQuery(".has-error .registrant\\.givenName p").text(jQuery("#error_givenname").val());
    jQuery(".has-error .registrant\\.surname p").text(jQuery("#error_surname").val());
    jQuery(".has-error .registrant\\.address p").text(jQuery("#error_street_address").val());
    jQuery(".has-error .registrant\\.email p").text(jQuery("#error_email_address").val());
    jQuery(".has-error .registrant\\.city p").text(jQuery("#error_city").val());
    jQuery(".has-error .registrant\\.state p").text(jQuery("#error_state").val());
    jQuery(".has-error .registrant\\.zip p").text(jQuery("#error_zip").val());
    jQuery(".has-error .registrant\\.country p").text(jQuery("#error_country").val());
    jQuery(".has-error .registrant\\.phone p").text(jQuery("#error_phone").val());
    jQuery(".has-error .registrant\\.jobTitle p").text(jQuery("#error_job_title").val());
    jQuery(".has-error .registrant\\.organization p").text(jQuery("#error_organization").val());
    jQuery(".has-error .customques p").text(jQuery("#error_custom_question").val());
    jQuery(".has-error .registrant\\.comments p").text(jQuery("#error_comments").val());
    jQuery(".has-error .customquesdrop p").text(jQuery("#error_choose_one").val());
});