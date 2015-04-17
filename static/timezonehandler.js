/**
 * TimeZone handler for Catalog and Registration page
 */

//on window load format the Registration page timezones 
Event.observe(window, 'load', function() {
    if(jQuery("body").attr("id") == "registration")
    {        
        //detect browser local timezone
        var browser_timezone = jstz.determine().name();
        //check if detected timezone is not same as training timezone
        if(browser_timezone && jQuery('#timezone').val() != browser_timezone) {
            //format the time of training to browser local
            formatRegistrationPageTimeAccordingToTimezone(browser_timezone);
        }
    }
});
jQuery(document).ready(function() {
    //identify the current timezone
    var browser_timezone = jstz.determine().name();   
    //click event handler
    if(jQuery("#timezone-modal-set").length) {
        //if page is registration page
        if(jQuery("body").attr("id") == "registration") {
            jQuery("#timezone-modal-set").click(function () {
                var tz = jQuery('#timezone').val();  
                //format the time(s) according to timezone
                 formatRegistrationPageTimeAccordingToTimezone(tz);
                 //@TODO need to see whether there is a better way
                 jQuery('.close').click();
            });    
        }
        //if page is catalog page
        if(jQuery("body").attr("id") == "catalog") {
            jQuery("#timezone-modal-set").click(function () {
                replaceCatalogPageWindowWithTimeZoneInfoAdded(jQuery('#timezone').val());
                //@TODO need to see whether there is a better way
                jQuery('.close').click();
            });
        }
    }
    
    //if the page is catalog page
    if(jQuery("body").attr("id") == "catalog") {
        //check if browser support local storage
        if(window.localStorage) {
            //first time load
            window.localStorage.setItem("firstTimeLoaded", "true");
        }
        //does not replace window if timezone info is already there
        if(browser_timezone && window.location.href.indexOf("tz") == -1 && window.localStorage.getItem("firstTimeLoaded") == "true") {
            //if browser supports localStorage
            if(window.localStorage) {
                //set first time load false
                window.localStorage.setItem("firstTimeLoaded", "false");
            } 
            //replace current window with timezone associated
            replaceCatalogPageWindowWithTimeZoneInfoAdded(browser_timezone);
        }
    }
});

/*Registration page timezone handler*/
function updateTimes(times) {
    if (jQuery('#recurrence-key').length) {
        doUpdateRecurringTimes(times);
    } else {
        doUpdateTimes(times);
    }
}

function doUpdateTimes(times) {
    var timesHtml = '';
    for (var i=0; i<times.length; i++) {
        var clazz = i == 0 ? "next" : "future";
        timesHtml += '<li class="' + clazz + '">' + times[i].time + '</li>';
    }
    jQuery('.all-times').html(timesHtml);
}

function doUpdateRecurringTimes(times) {
    var timesHtml = '';
    var isSelected = false;
    for (var i=0; i<times.length; i++) {
        var full = '';
        if (times[i].full) {
            full = ' disabled="disabled"';
        }
        // if the first option is full and disabled, this keeps it from being selected
        var selected = '';
        if (!isSelected && !times[i].full) {
            selected = ' selected="selected"';
            isSelected = true;
        }
        timesHtml += '<option value="' + times[i].trainingKey + '"' + full + selected + '>' + times[i].time + '</option>';
    }
    jQuery('#recurringTrainingTimesBox select').html(timesHtml);
}

/*
 * format the training time 
 * both for recurring and non-recurring trainings
 * depending onuser's browser time zone, detected by
 * JavaScript library "jsTimezoneDetect" -jstz
 */
function formatRegistrationPageTimeAccordingToTimezone(timezone)
{
   var dataObject = {};
   var selectedIndex = 0;
   if(jQuery("#recurring-time-select"))
       selectedIndex = jQuery("#recurring-time-select :selected").index();
    
    if(timezone != "") {
        dataObject["tz"] = timezone;
    }
    var ref_key = jQuery('#recurrence-key');
    if (ref_key.length) {
        dataObject["recurrenceKey"] = ref_key.val();
    }
    var training_key = jQuery('#training-key');
    if (training_key.length) {
        dataObject["trainingKey"] = training_key.val();
    }
    jQuery.ajax({
        url: "/training/times.json",
        data: dataObject,
        dataType: "json"
    }).then(function(json) {
        updateTimes(json.times);
    }).then(function() {
        jQuery("#registrant-tz").val(timezone);
    }).then(function() {
        if(jQuery("#recurring-time-select"))
            jQuery('#recurring-time-select option').eq(selectedIndex).prop('selected', true);
    });
}
    
/*Catalog Page timezone handler     */

/* replaces the current Catalog page 
 * window with timezone information
 * 
 */
function replaceCatalogPageWindowWithTimeZoneInfoAdded(timezone) {
    //check if url contains timezone information
    var pageUrl = window.location.href;
    
    //check if page already has the same timezone info
    if(pageUrl.indexOf(timezone) == -1)
    {
        if((pageUrl.indexOf("brandingId") !== -1 || pageUrl.indexOf("branding") !== -1) && pageUrl.indexOf("catalogId") !== -1) {
            pageUrl += '&tz=' + timezone;           
        }
        else {
          pageUrl = pageUrl.split("?")[0];
          pageUrl = pageUrl.split("#")[0];
          pageUrl += '?tz=' + timezone;
        }
        window.open(pageUrl, '_self', '');
        return false;
    }                
}