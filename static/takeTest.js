var qPerPage,qPage=0,numPages,numQuestions;
(function(jQuery){jQuery.previewTest=function(method){jQuery.previewTest.defaults={headerContainer:"#header",nextPageButton:"#nextPageButton",prevPageButton:"#prevPageButton",submitButton:"#submit",testInstructions:"#testInstructions",testInstructionsClose:"#testInstructionsCloseLink",testInstructionsShow:"#testInstructionsShowLink"};
var opts,methods;
methods={init:function(options){opts=jQuery.extend({},jQuery.previewTest.defaults,options);
jQuery(opts.prevPageButton).click(function(e){e.preventDefault();
helpers.prevPage()
});
jQuery(opts.nextPageButton).click(function(e){e.preventDefault();
helpers.nextPage()
});
qPerPage=parseInt(jQuery("#qPerPage").text());
numQuestions=jQuery("li.question").size();
if(numQuestions%qPerPage>0){numPages=parseInt(numQuestions/qPerPage)+1
}else{numPages=parseInt(numQuestions/qPerPage)
}if(jQuery(opts.testInstructions)){jQuery(opts.testInstructionsShow).click(function(e){e.preventDefault();
helpers.showTestInstructions()
});
jQuery(opts.testInstructionsClose).click(function(e){e.preventDefault();
helpers.hideTestInstructions()
})
}if(jQuery("#prevPageButton")){jQuery("#prevPageButton").hide()
}}};
var helpers={prevPage:function(){window.scrollTo(0,0);
if(qPage>0){helpers.toPage(--qPage);
if(qPage==0){jQuery(opts.prevPageButton).hide()
}jQuery(opts.nextPageButton).show();
jQuery(opts.submitButton).hide()
}},nextPage:function(){window.scrollTo(0,0);
if(qPage<numPages){helpers.toPage(++qPage);
if(qPage>0){jQuery(opts.prevPageButton).show()
}if(qPage==numPages-1){jQuery(opts.nextPageButton).hide();
jQuery(opts.submitButton).show()
}}},toPage:function(page){var j=0;
jQuery("li.question").each(function(i,ele){var aQuestion=jQuery(this);
j++;
var pageRange=(j/qPerPage)-page;
if(pageRange>0&&pageRange<=1){aQuestion.removeClass("hide")
}else{aQuestion.addClass("hide")
}})
},showTestInstructions:function(){jQuery(opts.testInstructions).show();
jQuery(opts.testInstructionsClose).show();
jQuery(opts.testInstructionsShow).hide()
},hideTestInstructions:function(){jQuery(opts.testInstructions).hide();
jQuery(opts.testInstructionsClose).hide();
jQuery(opts.testInstructionsShow).show()
}};
if(methods[method]){return methods[method].apply(this,Array.prototype.slice.call(arguments,1))
}else{if(typeof method==="object"||!method){return methods.init.apply(this,arguments)
}else{jQuery.error("Method '"+method+"' does not exist in pluginName plugin!")
}}}
})(jQuery);
jQuery(document).ready(function(){jQuery.previewTest()
});