Event.observe(window, 'load', function() {
    externalLinks();
    jQuery( 'a[data-popup]' ).each( function() {

        var theAnchor = jQuery( this );

        theAnchor.click( function( e ) {

            window.open( theAnchor.attr( 'href' ), 'popup', 'width=560, height=420, scrollbars=yes' );
            e.preventDefault();

        } );

    } );

});

(function($) {
    $.fn.showMaxCharCount = function(options) {
        $.fn.showMaxCharCount.defaults = {
            maxCharPopClass: 'maxCharPopup',
            hideClass: 'hide',
            showClass: 'show',
            maxLengthDefault: 128,
            maxCharDiv: 'maxCharDiv'
        };
        var opts = $.extend({}, $.fn.showMaxCharCount.defaults, options);
        return this
            .bind('focus.showMaxCharCount, click.showMaxCharCount, blur.showMaxCharCount, keyup.showMaxCharCount, keypress.showMaxCharCount, keydown.showMaxCharCount', function(event) {
                var target = $(event.target),
                    location = target.offset(),
                    inputLength = target.val().length,
                    args = new Array(),
                    theHeight,
                    nChars;
                if(!$('.' + opts.maxCharPopClass)[0]) $('body').append($('<div></div>').addClass(opts.hideClass+' '+opts.maxCharPopClass).attr('id', opts.maxCharDiv));
                if(target.attr('maxlength')) opts.maxLengthDefault = target.attr('maxlength');
                if(target.get(0).tagName == "TEXTAREA") {
                    nChars = $.trim(target.val()).substring(0, opts.maxLengthDefault).replace(/\n/g, "**").length - $.trim(target.val()).substring(0, opts.maxLengthDefault).length;
                    if(inputLength == null || isNaN(inputLength)) return;
                    if((inputLength + nChars) > opts.maxLengthDefault) {
                        if(event.keyCode == 8 || event.keyCode == 45 || event.keyCode == 46 || (event.keyCode >= 33 && event.keyCode <= 40)) return;
                        event.preventDefault();
                        target.val($.trim(target.val()).substring(0, inputLength - ((inputLength + nChars) - opts.maxLengthDefault))).scrollTop(target.height());
                    }
                } else {
                    nChars = 0;
                }
                args.push(Math.max(opts.maxLengthDefault - (inputLength + nChars), 0));
                args.push(parseInt(opts.maxLengthDefault));
                theHeight = ($.support.opacity) ? target.height() : target.innerHeight();
                $('#' + opts.maxCharDiv).text($.getMessage('validation.charLimitPopup', args)).css( {top: Math.ceil(location.top + theHeight) + 'px', left: location.left + 'px'} ).removeClass(opts.hideClass).addClass(opts.showClass);
                $(this).blur(function() {
                    if($('.' + opts.maxCharPopClass)) $('.' + opts.maxCharPopClass).remove();
                });
            });
        };
    })
(jQuery);

(function($) {
    $.getMessages = function() {
        var messages = new Array();
        $('span.springMessage').each(function(index, element) {
            messages.push({msgKey: $(this).attr('id'), msgVal: $(this).text()});
        });
        return messages;
    };
    $.getMessage = function(messageKey, args) {
        var messages = $.getMessages(),
            message;
        $(messages).each(function(index, element) {
            if(element.msgKey == messageKey) {
                message = element.msgVal;
                return false;
            }
        });
        if(message != undefined && args != undefined && args.length > 0) {
            $(args).each(function(index, element) {
                message = message.replace('{' + index + '}', element);
            });
        }
        return message;
    };
})
(jQuery);

function trim(theString) {
    return theString.strip();
}

/**
 * Class to handle displaying balloon popups.  Currently will display the ballon on mouse over
 * using a configurable delay time before the balloon displays and a configurable time before the
 * balloon will disappear (on mouse out).
 *
 * Example:
 *
 * var popups = new BalloonPopup(0.5, 1, {left: 0, top: 0});
 * popups.registerTrigger($('triggerId'));
 *
 * When a user mouseover the 'triggerId' element for > 0.5 seconds a balloon with id
 * 'balloon_triggerId' will be displayed.  The offset for the pointer will be centered on the
 * trigger element.  When the user mouse's out of the triggerId element or out of the balloon for
 * > 1.0 seconds, the balloon will fade away.
 */
var BalloonPopup = Class.create({

    /**
     * Initialize the class.
     *
     * @param delayShowTime time in seconds to delay showing the popup when mousing over trigger.
     * @param delayHideTime time in seconds to delay hiding the popup
     */
    initialize: function(delayShowTime, delayHideTime, offset) {
        this.delayShowTime = delayShowTime;
        this.delayHideTime = delayHideTime;
        this.offset = offset;
        this.lastBalloonId = null; // Last balloon that was displayed
        this.balloonHash = new Hash(); // Registered balloon id's
        this.triggerBalloonHash = new Hash(); // Trigger ID -> Balloon Id
        this.showBalloonHash = new Hash(); // Balloons queued up to be displayed
        this.hideBalloonHash = new Hash(); // Balloons queued up to be closed
        this.onShowBalloonHash = new Hash(); // Functions to be called when showing a balloon

        // Bind these methods to this class scope (needed so delay works correctly)
        this.showBalloon = this.showBalloonPrivate.bind(this);
        this.hideBalloon = this.hideBalloonPrivate.bind(this);
    },

    /**
     * Register the trigger that is used to show the balloon.
     *
     * @param triggerId the trigger element that will popup the balloon on mouse over.
     * @param balloonId the ballonId to display, if null, will be 'balloon_' + triggerId
     * @param onShowBalloon callback function when the balloon is to be displayed.
     */
    registerTrigger: function(triggerElement, balloonId, onShowBalloon) {

        // Setup events for the trigger
        triggerElement.observe('mouseover', this.mouseOverTrigger.bindAsEventListener(this));
        triggerElement.observe('mouseout', this.mouseOutTrigger.bindAsEventListener(this));
        var triggerId = triggerElement.identify();
        if (onShowBalloon) {
            this.onShowBalloonHash.set(triggerId, onShowBalloon);
        }

        // Setup events for the balloon
        if (!balloonId) {
            balloonId = "balloon_" + triggerId;
        }
        this.triggerBalloonHash.set(triggerId, balloonId);
        if (!this.balloonHash.get(balloonId)) {
            this.balloonHash.set(balloonId, true);
            $(balloonId).observe('mouseover', this.mouseOverBalloon.bindAsEventListener(this));
            $(balloonId).observe('mouseout', this.mouseOutBalloon.bindAsEventListener(this));
        }
    },

    /**
     * Display the balloon and position the carat accordingly.
     *
     * @param id the balloon id to display
     * @param element the trigger element (used for positioning)
     * @param offset the offset from the trigger element.
     */
    showBalloonPrivate: function(id, element) {

        // If a callback is registered, make the call
        var onShowBalloon = this.onShowBalloonHash.get(element.identify());
        if (onShowBalloon) {
            onShowBalloon(element);
        }

        var popupElement = $(id);
        var caratId = id + "_carat";
        var caratElement = $(caratId);
        if (popupElement.hasClassName("hide")) {
            popupElement.setStyle({ display: 'none' });
            popupElement.removeClassName("hide");
        }
        popupElement.show();
        if (this.lastBalloonId != null && this.lastBalloonId != id) {
            $(this.lastBalloonId).hide();
        }
        this.lastBalloonId = id;

        // Find the middle of the element that was clicked
        var pos = element.positionedOffset();
        var left = pos.left + (element.getWidth() / 2);
        var top = pos.top + (element.getHeight() / 2);
        if (this.offset != null) {
            // Horizontal alignment - 'left', 'center', 'right'
            if (this.offset.align != null) {
                if (this.offset.align == 'left') {
                    left = pos.left;
                } else if (this.offset.align == 'right') {
                    left = pos.left + element.getWidth();
                }
            }
            // Horizontal offset
            if (this.offset.left != null) {
                left += this.offset.left;
            }
            // Vertical alignment - 'top', 'center', 'bottom'
            if (this.offset.valign != null) {
                if (this.offset.valign == 'top') {
                    top = pos.top;
                } else if (this.offset.valign == 'bottom') {
                    top = pos.top + element.getHeight();
                }
            }
            // Vertical offset
            if (this.offset.top != null) {
                top += this.offset.top;
            }
        }

        // Find what the page dimensions and current scroll offset are so we can position the
        // balloon within the current visible area
        var pageDimensions = document.viewport.getDimensions();
        var scrollOffset = document.viewport.getScrollOffsets();
        var pageBox = {
            top: scrollOffset.top,
            left: scrollOffset.left,
            right: scrollOffset.left + pageDimensions.width,
            bottom: scrollOffset.top + pageDimensions.height
        };

        // Position the balloon based on what class the carat has
        var caratTop = 0;
        if (caratElement.hasClassName("right")) {
            left = left - popupElement.getWidth() - 20; // width of carat
            top = top - 24; // height from top of box to point of carat
            caratTop = 14 - popupElement.getHeight();
        } else if (caratElement.hasClassName("left")) {
            left = left + 20; // width of carat
            top = top - 24; // height from top of box to point of carat
            caratTop = 14 - popupElement.getHeight();
        } else if (caratElement.hasClassName("top")) {
            left = left - 24;
            top = top + 20;
            caratTop = -15 - popupElement.getHeight();
        } else if (caratElement.hasClassName("bottom")) {
            left = left - 24;
            top = top - 20;
            caratTop = -1;
        }

        // Show carat - it might have been hidden previously
        caratElement.show();

        //
        // Make sure the balloon is within the viewable page as best as we can position it
        //

        // Balloon is too far right, position 10px to right of viewable page
        if (left + popupElement.getWidth() > pageBox.right) {
            left = pageBox.right - popupElement.getWidth() - 10;
        }
        // Balloon is too far left, position 10px to left of viewable page
        if (left < pageBox.left) {
            left = pageBox.left + 10;
            caratElement.hide();
        }
        // Remove carat if we don't have any text to point at
        if (left - 30 < pos.left) {
            caratElement.hide();
        }
        // Balloon below bottom of viewable page, make it 10px above bottom of page
        if (top + popupElement.getHeight() > pageBox.bottom) {
            var topNew = pageBox.bottom - popupElement.getHeight() - 10;
            caratTop += top - topNew;
            top = topNew;
        }
        // Balloon above top of viewable page, make it 10px below top of page
        if (top < pageBox.top) {
            var topNew = pageBox.top + 10;
            caratTop += top - topNew;
            top = topNew;
        }
        // Carat is too low
        if (caratTop > -34) {
            caratElement.hide();
        }
        // Carat is too high (at least 10px from top of balloon)
        if (popupElement.getHeight() + caratTop - 10 < 0) {
            caratElement.hide();
        }

        // Position balloon tip
        popupElement.setStyle({
            left: left + 'px',
            top: top + 'px'
        });

        // Position carat
        caratElement.setStyle({
            marginTop: caratTop + 'px'
        });
    },

    /**
     * Called when the user moves the mouse over the trigger element.  This will cause the balloon
     * to be displayed after a short delay.
     *
     * @param event the event of the mouse over of the trigger.
     */
    mouseOverTrigger: function(event) {
        var triggerElement = event.element();
        var balloonId = this.triggerBalloonHash.get(triggerElement.identify());
        var timeoutId = this.showBalloon.delay(this.delayShowTime, balloonId, triggerElement);
        this.showBalloonHash.set(balloonId, timeoutId);
        this.clearHideTimeout(balloonId);
    },

    /**
     * Event when moving mouse away from the trigger element.  This will cause the balloon to close
     * after a short delay.  If the balloon was not yet displayed, remove the timeout event to show
     * the balloon so it doesn't popup.
     *
     * @param event the event of the mouse out of the trigger element.
     */
    mouseOutTrigger: function(event) {
        var element = event.element();
        var balloonId = this.triggerBalloonHash.get(element.identify());
        this.hideAndClearShowTimeout(balloonId);
    },

    /**
     * Mouse over (into) the balloon popup will cause any pending hide requests to be cancelled.
     * This allows the user a short time to move the mouse from the trigger into the balloon in
     * order to cut/paste elements or click on any links in the balloon.
     *
     * @param event the event of the mouse over into the balloon popup.
     */
    mouseOverBalloon: function(event) {
        var element = event.element();
        var id = element.identify();
        while (!this.balloonHash.get(id)) {
            element = element.ancestors()[0];
            id = element.identify();
        }
        this.clearHideTimeout(id);
    },

    /**
     * Event when moving mouse away from the balloon.  This will cause the balloon to close after
     * a short delay.  If the user moves back into the balloon, the balloon will still remain
     * displayed.
     *
     * @param event the event of the mouse out of the balloon popup.
     */
    mouseOutBalloon: function(event) {
        var element = event.element();
        var id = element.identify();
        while (!this.balloonHash.get(id)) {
            element = element.ancestors()[0];
            id = element.identify();
        }
        this.hideAndClearShowTimeout(id);
    },

    /**
     * When mousing over the trigger or into the balloon we want to clear any timeout event
     * scheduled to hide the balloon.  We still want it to be displayed if the user mouses back.
     *
     * @param balloonId the balloon id we don't want to close
     */
    clearHideTimeout: function(balloonId) {
        var timeoutId = this.hideBalloonHash.get(balloonId);
        if (timeoutId) {
            window.clearTimeout(timeoutId);
            this.hideBalloonHash.unset(balloonId);
        }
    },

    /**
      * When mousing out of the trigger or balloon we want to clear any timeout event scheduled to
      * show the balloon.
     */
    hideAndClearShowTimeout: function(balloonId) {
        var timeoutId = this.hideBalloon.delay(this.delayHideTime, balloonId);
        this.hideBalloonHash.set(balloonId, timeoutId);
        timeoutId = this.showBalloonHash.get(balloonId);
        if (timeoutId) {
            window.clearTimeout(timeoutId);
            this.showBalloonHash.unset(balloonId);
        }
    },

    /**
     * Hide the balloon - only if the balloonId is still in the pending queue to be closed.  This
     * allows the user to move the mouse back into the balloon to cancel the event.
     *
     * @param balloonId the balloonId to close.
     */
    hideBalloonPrivate: function(balloonId) {
        if (this.hideBalloonHash.get(balloonId)) {
            $(balloonId).fade({ duration: 0.25 });
            this.hideBalloonHash.unset(balloonId);
        }
    }
});

/**
 * Fix max-height css attribute for IE
 *
 * @param element element to fix
 * @param maxHeight the max height in em
 */
function fixMaxHeight(element, maxHeightEm) {
    var fontSize = element.getStyle('fontSize');
    if (fontSize.indexOf('px') > 0) {
        fontSize = fontSize.substring(0, fontSize.indexOf('px'));
    }
    var maxHeight = fontSize * maxHeightEm;
    if (element.getHeight() > maxHeight) {
        element.setStyle({
            height: maxHeight + 'px'
        });
    }
}

function externalLinks() {
	$$('a[rel=external]').each(function(element) {
		element.target = "_blank";
	});
}