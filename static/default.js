//This file is a place holder.
// Use this tile to add all per page javascript
jQuery(document).ready(function() {
	if(jQuery("body").attr("id") == "registration") {
		var dropDownElement = document.getElementById('registrant.country');
        if(dropDownElement) {
        	var options = dropDownElement.options;
        	var modifiedOptions = new Array();
            modifiedOptions.push('<option value="">Choose One...			</option>'); 
            modifiedOptions.push('<option value="US">United States</option>');
            modifiedOptions.push('<option value="AU">Australia</option>');
            modifiedOptions.push('<option value="GB">United Kingdom</option>');
            modifiedOptions.push('<option value="CA">Canada</option>');
            modifiedOptions.push('<option value="BR">Brazil</option>');
            modifiedOptions.push('<option class="select-dash" disabled="disabled">--------------------------------------------------------------------</option>');
            if(options) {
            	for(var count=0; count<options.length; count++) {
            	    if(options[count].value !== "US" 
            		   && options[count].value !== "AU" 
            		   && options[count].value !== "GB" 
            	 	   && options[count].value !== "CA" 
            		   && options[count].value !== "BR"
            		   && options[count].value !== "") {
            	       modifiedOptions.push('<option value="'+options[count].value+'">'+options[count].text+'</option>');
            	    }
               }
               jQuery('select[name="registrant.country"]').find("option").remove().end().append(modifiedOptions.join(" "));
            }
		}
    }
});