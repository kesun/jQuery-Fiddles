$(document).ready(function() {
    $(".boxFrame").hover(
		function(){
			$(this).children(".boxCaption").show();
			$(this).children(".boxContent").fadeTo("fast", 0.5);
			$(this).children(".boxContentMask").fadeTo("fast", 0.3);
			$(this).children(".boxCaption").animate({height: "+=80", top: "-=80"}, 200, "swing")
		},
		function(){
			$(this).children(".boxContent").fadeTo("fast", 1);
			$(this).children(".boxContentMask").fadeOut("fast");
			$(this).children(".boxCaption").animate({height: "-=80", top: "+=80"}, 200, "swing", function(){$(this).hide();});
		}
	);
});