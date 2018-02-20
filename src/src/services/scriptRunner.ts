import 'velocity';

export class ScriptRunner {

	$ : any;
	

   static runScript() : void{ 

       $(document).ready(function() {


			/* Defaults */
			// Timing
			var dynamicDuration = 300; 
			var dynamicDelay = 0;

			// Animate.css Class
			var animateCSSClass = 'fadeInUp';


			/* Window Resize Timer Function */
			var uniqueTimeStamp = new Date().getTime();

			var waitForFinalEvent = (function () {
				var timers = {};
				return function (callback, ms, uniqueId) {
					if (!uniqueId) {
						uniqueId = 'unique id';
					}
					if (timers[uniqueId]) {
						clearTimeout (timers[uniqueId]);
					}
					timers[uniqueId] = setTimeout(callback, ms);
				};
			})();

			/* Misc Chunks of Code */
			function qp_required_misc(){

				/* Dropdown Menu - Submenu */
				$('.dropdown-menu a.dropdown-toggle').on('click', function(e) {
					if (!$(this).next().hasClass('show')) {
						$(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
					}

					var subMenu = $(this).next(".dropdown-menu");
					subMenu.toggleClass('show');
					subMenu.prev().toggleClass('show');

					$(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
						$('.dropdown-submenu .show').removeClass("show");
					});

					return false;
				});

				/* Buttons */
				// Gradient Buttons
				$('.btn-gradient').each(function(){
					var thisBtn = $(this);
					var btnContent = thisBtn.html();
					var btnContentNew = '<span class="gradient">' + btnContent + '</span>';

					thisBtn.html(btnContentNew);
				});


				/* Cards */
				// Custom Scrollbar
				qp_add_scrollbar('.card-media-list', 'dark');
				// qp_add_scrollbar('.card-img-overlay', 'dark');

				// Create scroll where needed
				$('.has-scroll').each(function(){
					qp_add_scrollbar($(this), 'dark');
				});

				// Fix card-header button position when necessary
				$('.card-header').each(function(){
					var thisHeader = $(this);

					if(thisHeader.height() > 40){
						thisHeader.find('.header-btn-block').css({'top' : '31px'});
					}
				});


				/* Sidebar */
				// Menu Controls
				var parentLink = 'a.nav-parent';
				if($(parentLink).length){
					$('a.nav-parent').on('click', function(e){

						var clickedLink = $(this);

						if(clickedLink.closest('li').hasClass('open')){
							clickedLink.closest('li').removeClass('open');
							(<any> clickedLink.siblings('ul.nav')).velocity('slideUp', {
								easing: 'easeOutCubic',
								duration: dynamicDuration,
								delay: dynamicDelay,
								complete:
								function(elements){
									// callback here
									// Close all open children sub-menus
									clickedLink.closest('li').find('li').removeClass('open');
									clickedLink.closest('li').find('ul.nav').removeAttr('style');
								}
							});
						}else{
							// Opens its sub-menu
							clickedLink.closest('li').addClass('open');
							(<any> clickedLink.siblings('ul.nav')).velocity('slideDown', {
								easing: 'easeOutCubic',
								duration: dynamicDuration,
								delay: dynamicDelay,
								complete:
								function(elements){
									// callback here
								}
							});

							// Closes the sub-menus' and children sub-menus of other menu items in the same ul parent
							(<any>  clickedLink.closest('li').siblings('li.nav-item.open').find('ul.nav')).velocity('slideUp', {
								easing: 'easeOutCubic',
								duration: dynamicDuration,
								delay: dynamicDelay,
								complete:
								function(elements){
									// callback here
									$(this).removeAttr('style');
									$(this).closest('li').removeClass('open');
								}
							});

							// Closes the sub-menus' and children sub-menus of other menu items in other ul parents
							(<any> clickedLink.closest('ul').siblings('ul.nav').find('ul.nav')).velocity('slideUp', {
								easing: 'easeOutCubic',
								duration: dynamicDuration,
								delay: dynamicDelay,
								complete:
								function(elements){
									// callback here
									$(this).closest('li').removeClass('open');
									$(this).closest('li').removeClass('open');
								}
							});
						}

						e.preventDefault();
					});
				}

				// Menu Scroll
				var sidebarNav = 'nav.sidebar';				

				if($(sidebarNav).length){
					var windowHeight = $(window).height();
					
					// Set Height of the Left Column
					$(sidebarNav).height(windowHeight);

					// Destroy old scrollbar if present
					(<any> $(sidebarNav)).mCustomScrollbar("destroy");
					
					qp_add_scrollbar('nav.sidebar', 'light');

					// Add Hamburger Menu to .sidebar
					$('.sidebar > .mCustomScrollBox').before('<button class="hamburger hamburger--slider" type="button" data-target=".sidebar" aria-controls="sidebar" aria-expanded="false" aria-label="Toggle Sidebar"><span class="hamburger-box"><span class="hamburger-inner"></span></span></button>');

					// On window resize
					$(window).resize(function () {
						waitForFinalEvent(function(){
							var windowHeight = $(window).height();

							// Set Height of the Left Column
							$(sidebarNav).height(windowHeight);

							// Destroy old scrollbar if present
							(<any> $(sidebarNav)).mCustomScrollbar("destroy");

							// Destroy Hamburger
							$('.sidebar .hamburger').remove();

							// Add new scrollbar
							qp_add_scrollbar('nav.sidebar', 'light');

							// Add Hamburger Menu to .sidebar
							$('.sidebar > .mCustomScrollBox').before('<button class="hamburger hamburger--slider" type="button" data-target=".sidebar" aria-controls="sidebar" aria-expanded="false" aria-label="Toggle Sidebar"><span class="hamburger-box"><span class="hamburger-inner"></span></span></button>');

						}, 500, 'RandomUniqueString');
					});
				}

				// Hamburger Menu Controls
				$(document).on('click', 'button.hamburger', function(e){
					var mainNavbarHeight = $('.navbar-sidebar-horizontal').outerHeight();

					$('.sidebar-horizontal.fixed-top').css({'top' : mainNavbarHeight + 'px'});

					if($('.hamburger').hasClass('is-active')){
						$('.hamburger').removeClass('is-active');
						$('#sidebar').removeClass('open');
						$('.sidebar-horizontal').slideUp().promise().always(function(){
							$(this).removeAttr('style');
						});
					}else{
						$('.hamburger').addClass('is-active');
						$('#sidebar').addClass('open');
						$('.sidebar-horizontal').slideDown();
					}
					e.preventDefault();
				});


				/* Forms */
				// Input Group Highlight Color - Focus/Blur
				$('.input-group .form-control').focus(function(){
					$(this).closest('.input-group').addClass('focus');
				});

				$('.input-group .form-control').blur(function(){
					$(this).closest('.input-group').removeClass('focus');
				});


				/* Popover */
				( <any> $('[data-toggle="popover"]')).popover();


				/* Enable Tooltips */
				( <any> $('[data-toggle="tooltip"]')).tooltip();


				/* Auto-Links */
				// Allows you to make any element clickable without the affecting the style of the page
				$('[data-qp-link]').on('click', function(e){
					( <any> window).location = $(this).data('qp-link');
					e.preventDefault();
				});


				/* Signin, Signup, Forgotten Password */
				// Auto-adjust page height
				var signInLeftColumn = '.signin-left-column';
				if($(signInLeftColumn).length){
					var windowHeight = $(window).height();

					if(windowHeight > 630){
						$(signInLeftColumn).css({'height' : windowHeight + 'px'});
					}

					// On window resize
					$(window).resize(function () {
						waitForFinalEvent(function(){

							var windowHeight = $(window).height();

							if(windowHeight > 630){
								$(signInLeftColumn).css({'height' : windowHeight + 'px'});
							}

						}, 500, 'randomStringForSignupPage');
					});
				}

				// Add background image to the Right column
				var signInRightColumn = '.signin-right-column';
				if($(signInRightColumn).length){

					// Background Image
					if((typeof($(signInRightColumn).data('qp-bg-image')) !== 'undefined') && ($(signInRightColumn).data('qp-bg-image') != '')){
						var backgroundImage = $(signInRightColumn).data('qp-bg-image');

						$(signInRightColumn).css({'background-image' : 'url(assets/img/' + backgroundImage + ')'});
					}
				}


				/* CKEditor */
				var placeholder = '.load-ckeditor';
				if($(placeholder).length){
					(<any> $(placeholder)).ckeditor();
				}


				


				/* Color Controls */
				// Radio Select
				var customColorControl = $('.custom-color-control.custom-control.custom-radio');
				if(customColorControl.length){
					$('.custom-color-control.custom-control.custom-radio').each(function(){
						var thisObj = $(this);
						var color = thisObj.data('qp-color');

						thisObj.find('.custom-control-indicator').css({'background-color' : color});
					});
				}


				/* Animate on load */
				qp_animate_css();


				// Misc



				/* Misc */
				// Dropdown Menu - Make full right-column width
				if($('.dropdown-menu-fullscreen').length){
					var rightColumnWidth = $('.right-column').width();

					// Resize the .dropdown-menu-fullscreen
					$('.dropdown-menu-fullscreen').css({'width' : rightColumnWidth + 'px'});

					// Navbar Search - Works for all .nav-items for .dropdown-menu-fullscreen
					$('.dropdown-menu-fullscreen').closest('.nav-item').css({'position' : 'static'});

					// On window resize
					$(window).resize(function () {
						waitForFinalEvent(function(){
							var rightColumnWidth = $('.right-column').width();

							// Resize the .dropdown-menu-fullscreen
							$('.dropdown-menu-fullscreen').css({'width' : rightColumnWidth + 'px'});

						}, 500, uniqueTimeStamp);
					});
				}

				// Dropdown Width on Mobile
				// If browser width is less tha 576 then make dropdown menu of navbar fullscreen width
				var windowWidth = $(window).width();

				$('.dropdown-toggle').on('click', function(){
					if($(window).width() <= 576){
						$(this).siblings('.dropdown-menu').each(function(){
							if(!$(this).hasClass('dropdown-menu-fullscreen')){
								$(this).css({'position' : 'absolute', 'width' : windowWidth + 'px'});
								$(this).closest('.dropdown').css({'position' : 'static'});
							}
						});
					}else{
						$(this).siblings('.dropdown-menu').each(function(){
							if(!$(this).hasClass('dropdown-menu-fullscreen')){
								$(this).removeAttr('style');
								$(this).closest('.dropdown').removeAttr('style');
							}
						});
						// $('.dropdown-menu').removeAttr('style');
						// $('.dropdown-menu').closest('.dropdown').removeAttr('style');
					}
				});

				// Reloads the map function on window resize
				$(window).resize(function () {
					waitForFinalEvent(function(){
						// functions here...
						// $('.dropdown-menu').removeAttr('style');
						// $('.dropdown-menu').closest('.dropdown').removeAttr('style');

						if($(window).width() <= 576){
							$('.dropdown-toggle').on('click', function(){
								var windowWidth = $(window).width();
								$(this).siblings('.dropdown-menu').each(function(){
									if(!$(this).hasClass('dropdown-menu-fullscreen')){
										$(this).css({'position' : 'absolute', 'width' : windowWidth + 'px'});
										$(this).closest('.dropdown').css({'position' : 'static'});
									}
								});
							});
						}else{
							if(!$(this).hasClass('dropdown-menu-fullscreen')){
								$(this).siblings('.dropdown-menu').removeAttr('style');
								$(this).siblings('.dropdown-menu').closest('.dropdown').removeAttr('style');
							}
						}
					}, 500, 'uniqueTimeStamp+345');
				});

				// Unknown
				$('[data-toggle=offcanvas]').click(function() {
					$('.row-offcanvas').toggleClass('active');
				});

				// Removes MDB Waves Effect from respective items
				$('.no-waves-effect').removeClass('waves-effect');

				// Add dark waves to navbar
				// $('.navbar-nav > .nav-item > .nav-link').removeClass('waves-light').addClass('waves-dark');

			}


			/* Animate.css - Animation/Transition */
			function qp_animate_css(){

				// If the body class does not prevent animation, then animation occurs.
				// This overrides all animation calls
				if(!$('body').hasClass('no-animation')){

					$('[data-qp-animate-type]').each(function(){

						var mainElement = <any> $(this);

						if(mainElement.visible(true) || mainElement.closest('nav').hasClass('sidebar')){
							load_animation(mainElement);
						}

						$(window).scroll(function() {
							if(mainElement.visible(true)){
								load_animation(mainElement);
							}
						});

						function load_animation(mainElement){
					
							var animationName = '';

							if(typeof(mainElement.data('qp-animate-type')) === 'undefined'){
								var animationName = 'fadeInDown';
							}else{
								animationName = mainElement.data('qp-animate-type');
							}

							if(typeof(mainElement.data('qp-animate-delay')) === 'undefined'){
								var timeoutDelay = 0;
							}else{
								timeoutDelay = mainElement.data('qp-animate-delay');
							}

							var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

							if(mainElement.hasClass('invisible')){


								setTimeout(function(){
									mainElement.removeClass('invisible').addClass('animated ' + animationName).one(animationEnd, function(){
										$(this).removeClass(animationName);
										$(this).removeClass('animated');

										// If the element has infinite animation
										$(this).removeClass('infinite');
									});
								}, timeoutDelay);
							}

							if(mainElement.hasClass('invisible-children')){

								mainElement.children().each(function(){

									var thisElement = $(this);

									setTimeout(function(){
										thisElement.addClass('animated ' + animationName).one(animationEnd, function(){
											// Nothing to do after animation ends
										});
									}, timeoutDelay);

									timeoutDelay += 75;
								});
							}

							if(mainElement.hasClass('invisible-children-with-scrollbar')){

								mainElement.children('.mCustomScrollBox').find('.mCSB_container').children().each(function(){

									var thisElement = $(this);

									setTimeout(function(){
										thisElement.addClass('animated ' + animationName).one(animationEnd, function(){
											// Nothing to do after animation ends
										});
									}, timeoutDelay);

									timeoutDelay += 75;
								});
							}
						}
					});
				}
			}

			/* Hex to RGBA */
			function qp_hexToRgbA(hex, alpha){
				var r = parseInt(hex.slice(1, 3), 16),
				g = parseInt(hex.slice(3, 5), 16),
				b = parseInt(hex.slice(5, 7), 16);

				if(alpha){
					return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
				}else{
					return "rgb(" + r + ", " + g + ", " + b + ")";
				}
			}

			function qp_add_scrollbar(scrollContainer, scrollBarTheme){
				
				// Current Color Preset
				var colorPresetGlobal = $('body').data('color-preset');

				( <any> $(scrollContainer)).mCustomScrollbar({
					autoHideScrollbar: true,
					scrollbarPosition: 'inside',
					theme: scrollBarTheme,
					mouseWheel: {
						preventDefault: true
					}
				});
			}

			function qp_chart_sizes(chartID){
				// Card Chart Sizes
				var chartWidth : any;
				var chartHeight : any;

				chartWidth = $(chartID).parent().width();


				// Get the chart preset data-height.
				// If not present, then use the height of closest parent of .card-chart
				// If .card-body is smaller than the data-height (responsive fix), then use the height of .card-body
				if(typeof($(chartID).closest('.card-chart').data('chart-height')) === 'undefined'){
					chartHeight = 281;
				}else{
					if(chartWidth < 300){
						chartHeight = 281;
					}else{
						chartHeight = $(chartID).closest('.card-chart').data('chart-height');
					}
				}

				var chartSizes = [chartWidth, chartHeight];

				return chartSizes;
			}  

			function qp_timeline(){

				var timelineContainer = '.timeline';

				if($(timelineContainer).length){
					$(timelineContainer).each(function(){
						( <any> $(this)).timelify({
							animRight: "fadeInRight",
							animLeft: "fadeInLeft",
							animCenter: "fadeInUp"
						});
					});
				}
			}

			function qp_calendar(){

				var calendarContainer = '#calendar';

				if($(calendarContainer).length){

					/* Set Event Color In Dropdown List */
					$(calendarContainer).closest(".card-body").find(".calendar-controls .create-event .dropdown-menu .legend-block-item .legend-block-color-box, .calendar-controls .available-events .fc-event .legend-block-item .legend-block-color-box").each(function(){

						// Set variables 
						var eventColor = $(this).data("event-color");
						var highlightColor = "highlight-color-" + eventColor;
						var bgColor = "highlight-color-" + eventColor;

						// Set Dropdown Color
						$(this).addClass(bgColor);
					});

					/* Create Event */
					$("#add-available-event").on("click", function(){
						// Set variables
						var eventColorActive = $(this).siblings(".dropdown-menu").find(".legend-block-item.active .legend-block-color-box").data("event-color");
						var eventName = ( <any> $(this)).parent().siblings("#input-new-event").val().trim();
						$(this).parent().siblings("#input-new-event").val("");

						// Actual event creation
						if(eventName != ""){

							var newEventContent = "<div class='fc-event' style='opacity:0;'><div class='legend-block-item'><div class='legend-block-color'><div class='legend-block-color-box highlight-color-" + eventColorActive + "' data-event-color='" + eventColorActive + "'><i class='batch-icon batch-icon-droplet'></i></div></div><div class='legend-block-text'>" + eventName + "</div></div></div>";


							$(this).closest(".calendar-controls").find(".available-events .event-list").prepend(newEventContent);

							$(this).closest(".calendar-controls").find(".available-events .fc-event").first().delay(200).animate({"opacity":"1"}, 300);

							$(this).closest(".card-body").find('.calendar-controls .fc-event').each(function(){

								var thisEventColor = $(this).find(".legend-block-color-box").data("event-color");

								// create an Event Object
								// it doesn't need to have a start or end
								var eventObject = {
									title: $.trim($(this).text()), // use the element's text as the event title
									className: "highlight-color-" + thisEventColor, // use the element's text as the event title
								};

								// store the Event Object in the DOM element so we can get to it later
								$(this).data('event', eventObject);

								// make the event draggable using jQuery UI
								( <any> $(this)).draggable({
									zIndex: 999,
									revert: true, // will cause the event to go back to its
									revertDuration: 0 //  original position after the drag
								});
							});

						}else{
							$("#input-new-event").focus();
						}
					});

					/* Call Functions getActiveColor() */
					// Set Event Colors
					getActiveColor();

					/* Set Active Icon Color */
					/**
					 * getActiveColor handles the selected colors
					 */
					var getActiveColor = function(){
						var eventColorActive = $(calendarContainer).closest(".card-body").find(".calendar-controls .create-event .dropdown-menu .legend-block-item.active .legend-block-color-box").data("event-color");

						// Set data-event-color. Then create the highlight class
						var theButton = $(calendarContainer).closest(".card-body").find(".calendar-controls .create-event .dropdown-toggle");
						var colorIndicator = theButton.closest('.input-group-btn').siblings('.input-group-addon');
						// theButton.attr("data-event-color",eventColorActive);
						theButton.addClass("highlight-color-" + eventColorActive);
						colorIndicator.addClass("highlight-color-" + eventColorActive);

						// Change the active icon color on click
						var listItem = $(calendarContainer).closest(".card-body").find(".calendar-controls .create-event .dropdown-menu .legend-block-item");

						listItem.on("click", function(){

							var newEventColor = $(this).find(".legend-block-color-box").data("event-color");

							var regex = new RegExp('\\b' + 'highlight-color-' + '.+?\\b', 'g');
							theButton[0].className = theButton[0].className.replace(regex, '');

							theButton.addClass("highlight-color-" + newEventColor);
							colorIndicator.removeAttr('class').addClass("input-group-addon highlight-color-" + newEventColor);

							// Remove active class from siblings then add to this item
							$(this).siblings().removeClass("active");
							$(this).addClass('active');
							$("#input-new-event").focus();
						});
					}

					/* Initialize the external events */
					$(calendarContainer).closest(".card-body").find('.calendar-controls .fc-event').each(function() {

						var thisEventColor = $(this).find(".legend-block-color-box").data("event-color");

						// store data so the calendar knows to render an event upon drop
						$(this).data('event', {
							title: $.trim($(this).text()), // use the element's text as the event title
							className: "highlight-color-" + thisEventColor, // use the element's text as the event title
							stick: true // maintain when user navigates (see docs on the renderEvent method)
						});

						// make the event draggable using jQuery UI
						( <any> $(this)).draggable({
							zIndex: 999,
							revert: true,      // will cause the event to go back to its
							revertDuration: 0  //  original position after the drag
						});

					});

					/* Initialize the calendar */
					( <any> $(calendarContainer)).fullCalendar({
						header: {
							left: 'prev,next today',
							center: 'title',
							right: 'month,agendaWeek,agendaDay'
						},
						themeSystem: 'bootstrap3',
						defaultDate: '2017-11-12',
						editable: true,
						droppable: true, // this allows things to be dropped onto the calendar
						eventLimit: true, // allow "more" link when too many events
						events: [
						{
							title: 'All Day Event',
							start: '2017-11-01',
							className: "highlight-color-red"
						},
						{
							title: 'Long Event',
							start: '2017-11-07',
							end: '2017-11-10',
							className: "highlight-color-yellow"
						},
						{
							id: 999,
							title: 'Repeating Event',
							start: '2017-11-09T16:00:00',
							color: "#ff0097"
						},
						{
							id: 999,
							title: 'Repeating Event',
							start: '2017-11-16T16:00:00',
							className: "highlight-color-purple"
						},
						{
							title: 'Conference',
							start: '2017-11-11',
							end: '2017-11-13',
							className: "highlight-color-green"
						},
						{
							title: 'Meeting',
							start: '2017-11-12T10:30:00',
							end: '2017-11-12T12:30:00',
							className: "highlight-color-green"
						},
						{
							title: 'Lunch',
							start: '2017-11-12T12:00:00',
							color: "#6ec06e"
						},
						{
							title: 'Meeting',
							start: '2017-11-12T14:30:00',
							className: "highlight-color-red"
						},
						{
							title: 'Happy Hour',
							start: '2017-11-12T17:30:00',
							className: "highlight-color-red"
						},
						{
							title: 'Dinner',
							start: '2017-11-12T20:00:00',
							className: "highlight-color-blue"
						},
						{
							title: 'Birthday Party',
							start: '2017-11-13T07:00:00'
						},
						{
							title: 'Click for Google',
							url: 'https://base5builder.com/',
							start: '2017-11-28'
						}
						],
						drop: function() {
							$(this).remove();
						},
						eventAfterAllRender: function() {
							$(calendarContainer).find('.glyphicon.glyphicon-chevron-right').removeAttr('class').addClass('batch-icon batch-icon-arrow-right');
							$(calendarContainer).find('.glyphicon.glyphicon-chevron-left').removeAttr('class').addClass('batch-icon batch-icon-arrow-left');
						}
					});
				}
			}

			function qp_mailbox_list(){

				var placeholder = '.mailbox-email-list';

				if($(placeholder).length){

					// First clear all checkboxes on page load
					$(placeholder + ' .email-item-checkbox .custom-control-input').removeAttr('checked');

					/* Select All Feature */
					var selectAll = $(placeholder + ' .email-select-all .custom-checkbox');

					selectAll.on('click', function(){

						if($(this).hasClass('active')){
							$(this).find('.custom-control-input').removeAttr('checked');
							$(placeholder + ' .email-item-checkbox .custom-control-input').removeAttr('checked');
							$(this).removeClass('active');

							// Then disable the menu controls
							$(placeholder + ' .mailbox-control-group .btn').addClass('disabled');
							$(placeholder + ' tr').removeClass("highlighted");
						}else{
							$(this).find('.custom-control-input').attr('checked', 'checked');
							$(placeholder + ' .email-item-checkbox .custom-control-input').attr('checked', 'checked');
							$(this).addClass('active');

							// Then enable the menu controls
							$(placeholder + ' .mailbox-control-group .btn').removeClass('disabled');
							$(placeholder + ' tr').addClass("highlighted");
						}

						return false;
					});

					// Individual Checkbox
					$(placeholder + ' .email-item-checkbox').on('click', function(){
						var thisCheckbox = $(this);

						var checkedCount = 0;

						if(thisCheckbox.find('.custom-control-input').is(':checked')){
							thisCheckbox.find('.custom-control-input').removeAttr('checked');
							thisCheckbox.closest('tr').removeClass("highlighted");

							// Then disable the menu controls
							thisCheckbox.closest('tr').siblings('tr').each(function(){
								if($(this).find('.custom-control-input').is(':checked')){
									checkedCount++;
								}
							});

							if(checkedCount < 1){
								$(placeholder + ' .mailbox-control-group .btn').addClass('disabled');
							}

						}else{
							thisCheckbox.find('.custom-control-input').attr('checked', 'checked');
							thisCheckbox.closest('tr').addClass("highlighted");

							// Then enable the menu controls
							$(placeholder + ' .mailbox-control-group .btn').removeClass('disabled');
						}
						return false;
					});

					/* B5B Documentation: Control Actions - You will have to connect your Server and Database to these code chunks - Start */

					// Refresh Email
					$(".email-refresh").on("click", function(e){
						// B5B Documentation:
						// Use Ajax to pull your own data from the database
						// ADD YOUR AJAX CODE HERE. On success, call the code below or write a one that suits your needs
						// B5B Documentation: End

						location.reload();
						e.preventDefault();
					});

					// Mark Read
					$(".email-mark-read").on("click", function(e){
						// B5B Documentation:
						// Use Ajax to pull your own data from the database
						// ADD YOUR AJAX CODE HERE. On success, call the code below or write a one that suits your needs
						// B5B Documentation: End

						$(".mailbox-email-list tr").each(function(){
							if($(this).hasClass('email-status-unread') && $(this).find('.email-checkbox .custom-control-input').is(':checked')){
								$(this).removeClass("email-status-unread");
							}else if(!$(this).hasClass('email-status-unread') && $(this).find('.email-checkbox .custom-control-input').is(':checked')){
								$(this).addClass("email-status-unread");
							}
						});

						// After mark as read, then change the button to mark as unread and allow the person to click the button again. Maybe just change the icon to something else
						e.preventDefault();
					});

					// Delete Email
					$(".email-delete").on("click", function(e){
						// B5B Documentation:
						// Use Ajax to pull your own data from the database
						// ADD YOUR AJAX CODE HERE. On success, call the code below or write a one that suits your needs
						// B5B Documentation: End

						$(".mailbox-email-list tr").each(function(){
							if($(this).find('.email-checkbox .custom-control-input').is(':checked')){
								// $(this).removeClass("email-status-unread");

								(<any> $(this)).velocity('slideUp', {
									easing: 'easeOutCubic',
									duration: dynamicDuration,
									delay: dynamicDelay,
									complete:
									function(elements){
										// callback here
										$(this).remove();
									}
								});
							}
						});

						$(".alert").remove();

						var messageDeleteText = '<strong>Deleted!</strong> Email(s) deleted.';

						var messageDelete = '<div class="alert alert-success alert-dismissable" style="opacity:0;"><button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>' + messageDeleteText + '</div>';

						$(".mailbox-controls").after(messageDelete);
						$(".alert").animate({"opacity":1}, 300);
						$(".email-mark-read, .email-mark-important, .email-mark-junk, .email-delete").addClass("disabled");

						selectAll.find('.custom-control-input').removeAttr('checked');

						e.preventDefault();
					});

					// Mark as Junk
					$(".email-mark-junk").on("click", function(e){
						// B5B Documentation:
						// Use Ajax to pull your own data from the database
						// ADD YOUR AJAX CODE HERE. On success, call the code below or write a one that suits your needs
						// B5B Documentation: End

						$(".mailbox-email-list tr").each(function(){
							if($(this).find('.email-checkbox .custom-control-input').is(':checked')){
								// $(this).removeClass("email-status-unread");

								( <any> $(this)).velocity('slideUp', {
									easing: 'easeOutCubic',
									duration: dynamicDuration,
									delay: dynamicDelay,
									complete:
									function(elements){
										// callback here
										$(this).remove();
									}
								});
							}
						});

						$(".alert").remove();

						var messageJunkText = '<strong>Moved!</strong> Email(s) have been moved to the Junk Folder.';

						var messageJunk = '<div class="alert alert-success alert-dismissable" style="opacity:0;"><button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button>' + messageJunkText + '</div>';

						$(".mailbox-controls").after(messageJunk);
						$(".alert").animate({"opacity":1}, 300);
						$(".email-mark-read, .email-mark-important, .email-mark-junk, .email-delete").addClass("disabled");

						selectAll.find('.custom-control-input').removeAttr('checked');

						e.preventDefault();
					});

					/* Control Actions - You will have to connect your Server and Database to these code chunks - End */

					/* Individual Email Features */
					$(".mailbox-email-list tr").each(function(){

						/* Star Email Feature */
						$(this).find(".email-star").on("click", function(){
							$(this).find(".email-star-status").toggleClass("checked");
						});

						/* Get and Set Email URL */
						var emailURL = $(this).data("email-url");

						$(this).find(".email-sender, .email-subject, .email-datetime").on("click", function(){
							window.location.href = emailURL;
						});
					});
				}
			}

			function qp_mailbox_message_view(){
				if($("#show-others").length){
					$("#show-others").on("click", function(e){
						$(".message-recepient-others").slideToggle(300);
						e.preventDefault();
					});
				}
			}
		

			function qp_datatables(){

				// All datatables must have the class ".datatables" added to their table tag
				var placeholder = '.table-datatable';

				if($(placeholder).length){
					$(placeholder).each(function(){
						( <any> $(this)).DataTable();
					});
				}
			} 
		
		

			function qp_task_list(){

				var taskList = '.card-task-list';

				if($(taskList).length){

					if($(taskList).closest('.card').hasClass('card-xs') || $(taskList).closest('.card').hasClass('card-sm') || $(taskList).closest('.card').hasClass('card-md') || $(taskList).closest('.card').hasClass('card-lg')){
						qp_add_scrollbar(taskList, 'dark');
					}

					var taskListItem = $(taskList + ' .task-list-item .custom-checkbox');
 

					// Count Completed & Total Tasks
					var taskCount = function(addCount){
						if(typeof(addCount) === 'undefined'){
							addCount = 0;
						}
						var tasksCompleted = taskListItem.closest('.card-task-list').find("label.active").length + addCount;
						var tasksTotal = taskListItem.closest('.card-task-list').find(".task-list-item").length;

						taskListItem.closest('.card').find(".card-header .task-list-stats .task-list-completed").text(tasksCompleted);
						taskListItem.closest('.card').find(".card-header .task-list-stats .task-list-total").text(tasksTotal);

						// Update Progress Bar
						var completionPercentage = (tasksCompleted / tasksTotal) * 100;

						var progressBar = taskListItem.closest('.card').find(".card-header .progress-bar");

						progressBar.css({"width": completionPercentage + "%"}).attr("aria-valuenow", completionPercentage);
					}

					taskListItem.on('click', function(){

						( <any> $(this)).button('toggle');

						// Update task count
						taskCount(undefined);

						// This creates an "anti-active" class which prevents the item from being striked-out
						if($(taskList).hasClass('no-strike-out')){
							$(this).addClass('anti-active');
						}
					});

					if(!$(taskList).hasClass('no-strike-out')){
						taskListItem.each(function(){
							var checkedStatus = $(this).find('.custom-control-input').is(':checked');

							if(checkedStatus){
								$(this).addClass('active');
							}
						});
					}

					// Get the starting task count
					taskCount(undefined);

					$(taskList).find(".task-item-controls .show-task").on("click", function(e){
						$(this).closest(".task-list-item").find(".task-item-details").slideToggle(300);
						e.preventDefault();
					});
				}
			}



			/**
			 * REQUIRED FUNCTIONS - START
			 */
			
			// DO NOT REMOVE THIS!!!
			qp_required_misc();


			/* Resize certain elements on window resize */
			// Copy the functions loaded above and paste them below. Only works for certain functions
			// Line Charts functions should be copied here too
			$(window).resize(function () {
				waitForFinalEvent(function(){
					// functions here...
					
				}, 500, 'thisstringisunsdsaique');
			});

			/* REQUIRED FUNCTIONS - END */



			/**
			 * DEMO USE ONLY - START
			 * Do not copy the content below when you are building your site.
			 */
			
			qp_task_list();

			qp_timeline();

			qp_calendar();

			
			qp_mailbox_list();
			qp_mailbox_message_view();
			
			qp_datatables();

			
			
			// ui-charts.html
			
			

			/* DEMO CALLS - END */
		});  
		
    }
}