/*
	rdQuery views, 
	Created by:	Markus Giesen
	Co-authors: Angel Chuang
	
	createDate: 	2009-11-26
	lastChange:		2011-07-21
	
	This framework requires jQuery to work and the rdQuery framework for the fancy RQL bits..
*/
/* jQuery JSON plugin: http://code.google.com/p/jquery-json/ */
(function($){$.toJSON=function(o)
{if(typeof(JSON)=='object'&&JSON.stringify)
return JSON.stringify(o);var type=typeof(o);if(o===null)
return"null";if(type=="undefined")
return undefined;if(type=="number"||type=="boolean")
return o+"";if(type=="string")
return $.quoteString(o);if(type=='object')
{if(typeof o.toJSON=="function")
return $.toJSON(o.toJSON());if(o.constructor===Date)
{var month=o.getUTCMonth()+1;if(month<10)month='0'+month;var day=o.getUTCDate();if(day<10)day='0'+day;var year=o.getUTCFullYear();var hours=o.getUTCHours();if(hours<10)hours='0'+hours;var minutes=o.getUTCMinutes();if(minutes<10)minutes='0'+minutes;var seconds=o.getUTCSeconds();if(seconds<10)seconds='0'+seconds;var milli=o.getUTCMilliseconds();if(milli<100)milli='0'+milli;if(milli<10)milli='0'+milli;return'"'+year+'-'+month+'-'+day+'T'+
hours+':'+minutes+':'+seconds+'.'+milli+'Z"';}
if(o.constructor===Array)
{var ret=[];for(var i=0;i<o.length;i++)
ret.push($.toJSON(o[i])||"null");return"["+ret.join(",")+"]";}
var pairs=[];for(var k in o){var name;var type=typeof k;if(type=="number")
name='"'+k+'"';else if(type=="string")
name=$.quoteString(k);else
continue;if(typeof o[k]=="function")
continue;var val=$.toJSON(o[k]);pairs.push(name+":"+val);}
return"{"+pairs.join(", ")+"}";}};$.evalJSON=function(src)
{if(typeof(JSON)=='object'&&JSON.parse)
return JSON.parse(src);return eval("("+src+")");};$.secureEvalJSON=function(src)
{if(typeof(JSON)=='object'&&JSON.parse)
return JSON.parse(src);var filtered=src;filtered=filtered.replace(/\\["\\\/bfnrtu]/g,'@');filtered=filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']');filtered=filtered.replace(/(?:^|:|,)(?:\s*\[)+/g,'');if(/^[\],:{}\s]*$/.test(filtered))
return eval("("+src+")");else
throw new SyntaxError("Error parsing JSON, source is not valid.");};$.quoteString=function(string)
{if(string.match(_escapeable))
{return'"'+string.replace(_escapeable,function(a)
{var c=_meta[a];if(typeof c==='string')return c;c=a.charCodeAt();return'\\u00'+Math.floor(c/16).toString(16)+(c%16).toString(16);})+'"';}
return'"'+string+'"';};var _escapeable=/["\\\x00-\x1f\x7f-\x9f]/g;var _meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'};})(jQuery);



// Define global variables / info panels
var $rdQueryLoadingPanel = jQuery('<div id="rdQueryLoadingPanel">some dialog content</div>').hide().appendTo('body');
var $rdQueryLoadingMsg = jQuery('<div><div class="loadingSpinner"></div> <span>Just a moment, please.</span></div>');
var maxNavLevelsAllowed = 3;
var $breadcrumbSelector = jQuery('#breadcrumb');
var msgTooManyNavLevels = "Sorry, you can't create more than 5 navigation levels.";

jQuery(function() {

// general functions
	var getDateFromCMSDate = function(cmsDate,bShowtime) {
		 if (cmsDate == "" || typeof(cmsDate) === "undefined"){
		  return false;
		};
		parts = cmsDate.split('.');
		// date part
		// var d = new Date(year, month, day, hours, minutes, seconds, milliseconds);
		var val = new Date( 1899, 11, 30, 00, 00, 00 );
		val.setDate(val.getDate()+parseInt(parts[0]));
	  
		//date and time
		if(parts.length == 2 && bShowtime === true) {
		  secs = parseFloat(cmsDate-parts[0])*(60*60*24);	  
		  val.setSeconds(val.getSeconds()+secs); //num of seconds
		  return val.toString( "dd/MM/yyyy HH:mm:ss" );
		}
		Date.prototype.toDDMMYYYYString = function () {return isNaN (this) ? 'NaN' : [this.getDate() > 9 ? this.getDate() : '0' + this.getDate(), this.getMonth() > 8 ? this.getMonth() + 1 : '0' + (this.getMonth() + 1), this.getFullYear()].join('/')}
		return val.toDDMMYYYYString(); // val.toString( "dd/MM/yyyy" );
	}; 

// createPage	
	var pagename = jQuery("#pagename"),
		allFields = jQuery([]).add(pagename),
		tips = jQuery(".validateTips");

	function updateTips(t) {
		tips
			.text(t)
			.addClass('ui-state-highlight');
		setTimeout(function() {
			tips.removeClass('ui-state-highlight', 1500);
		}, 500);
	}

	function checkLength(o,n,min,max) {
		if ( o.val().length > max || o.val().length < min ) {
			o.addClass('ui-state-error');
			updateTips("Length of " + n + " must be between "+min+" and "+max+".");
			return false;
		} else {
			return true;
		}
	}

	function checkRegexp(o,regexp,n) {
		if ( !( regexp.test( o.val() ) ) ) {
			o.addClass('ui-state-error');
			updateTips(n);
			return false;
		} else {
			return true;
		}
	}
	
	// add dialog form
	var addDialogFunctionality = function(){
		jQuery("#dialog-form-newpage").dialog({
			autoOpen: false,
			height: 300,
			width: 400,
			modal: true,
			buttons: {
				'Create new page': function() {
					var bValid = true;
					allFields.removeClass('ui-state-error');
					bValid = bValid && checkLength(pagename,"page name",3,250);
					bValid = bValid && checkRegexp(pagename,/^[0-9a-z]([0-9a-z_ -?!&#$*\/])+$/i,"Page name may consist of a-z, 0-9, underscore, begin with a letter or number.");
					
					if (bValid) {
						try {
							// load settings from HTML element into setting variable for script use
							eval(jQuery('#newPage span').html());
						}
						catch ( e ) {
							alert ( e );
						}

						try {
							var openNewPage = true;
							if(jQuery('#rdquery-ccselect').length == 1){
								settings.strContentClassGuid = jQuery('#rdquery-ccselect option:selected').attr('value');
							}
							if(settings.strContentClassGuid.length > 32){
								settings.strContentClassGuid = settings.strContentClassGuid.substr(0,32);
								openNewPage = false;
							}
							if(typeof(pagename.val()) === "undefined" || (typeof(settings.strContentClassGuid) === "undefined" || typeof(settings.strLinkGuid) === "undefined")){
								alert('Error: Missing settings for page creation');
							}else{

								jQuery(this).dialog('destroy').remove();
								jQuery('div.ui-dialog').dialog('destroy').remove();
								
								jQuery('#rdQueryLoadingPanel').html($rdQueryLoadingMsg);
								jQuery('#rdQueryLoadingPanel').dialog({
									closeOnEscape: false,
									height: 75,
									modal: true
								});
								jQuery('.ui-dialog-titlebar').remove();
								jQuery('.ui-resizable-handle').remove();

								rdQuery.GetStructureElementGuidByElementName(settings.strLinkGuid, cmspage.guid, function(guiddata){
									strLinkGuid = guiddata;
									strPageNameNoAmpersand = pagename.val().replace(/&/g,"&amp;").replace(/"/g,"&quot;");
									rdQuery.CreateAndConnectPage(strPageNameNoAmpersand,settings.strContentClassGuid,strLinkGuid,function(data) {
										// Commenting out below code in case we ever need it again
										// Checks if user has permission to create a new page and provides appropriate feedback if not
										/*if(data.indexOf("You do not have permission to create a new page for this link.") != -1) {
											alert("You do not have permission to create a new page.");
											location.reload(true);
										}
										else {*/
											var xml = jQuery(data).text(); // xml response is actually the encoded cdata of the root element
											// Data extract method
											var strPage = rdQuery.FilterDataFromXML(xml,'page');
											var strPageGuid = ""; // FilterDataFromXML(xml,'element[eltname="'+strElName+'"]');
											strPageGuid = jQuery(strPage).attr('guid');
											if(openNewPage==false){
												// if the new page isn't supposed to be opened, just reload the current page in edit mode
												strPageGuid = cmspage.guid;
											}
											var newhref = '/cms/webclient/PreviewHandler.ashx?Action=RedDot&Mode=2&projectguid=' + rdQuery.vars.strProjectGuid + '&pageguid=' + strPageGuid;
											newhref += "&EditPageGUID=" + strPageGuid + "&";
											newhref += "Opener=1";
											// after creating the new page, make sure you open it up!
											window.location.href = newhref;
										/*}*/
									});
									
								});
								
							}
						}
						catch ( e ) {
							alert ( e );
						}
						return false;
					}
				},
				Cancel: function() {
					jQuery(this).dialog('close');
				}
			},
			close: function() {
				allFields.val('').removeClass('ui-state-error');
			}
		}).bind("keypress", function(e) { // allow page creation by pressing "enter" inside of form
			 if (e.keyCode == 13) {
				 jQuery(this).parent().find('.ui-dialog-buttonset button:first-child').click();
				 return false;
			}
		});
		$('.ui-resizable-handle').remove();
	}
	var addTemplateSelectorToDialogForm = function(){
		var contentclassselector = '<label for="rdquery-ccselect"><span>Select a template</span><br /><select id="rdquery-ccselect">';
		try {
			// set content class guid for new child pages if defined in parent content class
			var ccguidnewpages = cmspage.ccguidnewpages;
			if(jQuery(ccguidnewpages).length >= 1) {
				jQuery.each(ccguidnewpages, function(i, val) {
					contentclassselector+= '<option value="' + val + '">' + i + '</option>';
				});
				contentclassselector+= '</select></label>';
			}else{
				contentclassselector = '';
			}
		}
		catch ( e ) {
			alert ( e );
		}
		// var cmsnewpagedialog = jQuery('<div id="dialog-form-newpage" title="Create new page"><p class="validateTips">&nbsp;</p><form><fieldset>' + contentclassselector + '<label for="pagename">Please enter a page name</label><input type="text" name="pagename" id="pagename" class="text ui-widget-content ui-corner-all" /></fieldset></form></div>');
		jQuery(contentclassselector).appendTo('#rdquery-js-fields');
	}
	
	
	
	// add cms menu
	var cmsmenu = jQuery('<div id="cmsmenu"></div>');
	cmsmenu.appendTo('#cmsmenuinsert'); 

	if(typeof(cmspage.showcreatepage)!='undefined' && cmspage.showcreatepage==='true'){
		
		var ccguidnewpages = cmspage.ccguidnewpages;
		
		//set up page creation form
		addDialogFunctionality();
		addTemplateSelectorToDialogForm();
		
		// add "create new page link to bar"
		var cmsnewpage = jQuery('<div id="newPage"><a href="#">Create a new page<span style="display:none;">var settings = {strPageHeadline:"New Page",strContentClassGuid:"' + ccguidnewpages + '", strLinkGuid:"list_nav"};</span></a></div>');
		cmsnewpage.click(function () {
			if(jQuery($breadcrumbSelector).children().length>maxNavLevelsAllowed){
				alert(msgTooManyNavLevels);
				return false;
			}
			jQuery('#dialog-form-newpage').dialog('open');
		}).addClass('active');
	
	
		cmsnewpage.appendTo('#cmsmenu'); // removed for DOP project
		// cmsnewpage.appendTo('#addnewspage');
		
		// add file name to menu field
		var cmspagefilename = jQuery('<div id="filenameEdit"><form action="" id="filenameform"><label for="filename">Filename: <input id="filename" class="filename inactive" type="text" value="" /></label><input class="savefilename" type="submit" value="Save" /></form></div>');
	}
	else
	{
		var cmspagefilename = jQuery('<div id="filenameEdit" class="noCreatePage"><form action="" id="filenameform"><label for="filename">Filename: <input id="filename" class="filename inactive" type="text" value="" /></label><input class="savefilename" type="submit" value="Save" /></form></div>');
	}
	
	var cmspagecreator = jQuery('<div id="pageInfoCreated"><span class="label">Created:</span> <span class="user"></span> <span class="time"></span></div>');
	var cmspagechanger = jQuery('<div id="pageInfoChanged"><span class="label">Last changed:</span> <span class="user"></span> <span class="time"></span></div>');
	var cmspageid = jQuery('<div id="pageInfoId"><span class="label">Page ID:</span> <span class="id"></span></div>');
	var cmspagestatus = jQuery('<div id="pageInfoStatus"><span class="label">Page Status:</span> <span class="status"></span></div>');
	var cmspageapproval = jQuery('<div id="pageInfoApproval"><span class="label">Last approved by:</span> <span class="user"></span> <span class="time"></span></div>');
	var cmspagelockinfo = jQuery('<p id="pageInfoLock"><em><a><span class="user"></span>&nbsp;<span>editing since</span> <span class="time"></span></a></em></p>');
	
	rdQuery.GetPageInformation(cmspage.guid, function(data){
		// filename field and show save button when saving is required
		oldSaveVal = jQuery('#filenameform .savefilename').val();
		jQuery('#filenameform .filename').val(data.strFilename).focus(function(){
			jQuery(this).removeClass('inactive');
		}).blur(function(){
			jQuery(this).addClass('inactive');
		}).keyup(function(){
			if(jQuery(this).val()!=data.strFilename){
				jQuery('#filenameform .savefilename').addClass('saving-req');
			}else{
				jQuery('#filenameform .savefilename').removeClass('saving-req');
			}
		});
		
		// save button
		jQuery('#filenameform .savefilename').click(function(){
			strPageFilename = jQuery('#filenameform .filename');
			var errMsg = "";
			if ( strPageFilename.val().length > 250 || strPageFilename.val().length < 3 ) {
				errMsg +="Length of filename must be between 3 and 250.";
			}
			// regexp = /^[a-z]([0-9a-z_-])+$/i;
			regexp = /^[0-9a-z]([0-9a-z\-\\.])+$/;
			
			if (!(regexp.test(strPageFilename.val()))) {
				if(errMsg!="") {
					errMsg += "\r\n";
				}
				errMsg +="Page name may consist of a-z, 0-9 and dashes";
			}
			if(errMsg!=""){
				strPageFilename.addClass('error');
				alert(errMsg);
				strPageFilename.removeClass('error');
				return false;
			}else{
				jQuery('#filenameform .savefilename').val('Saving...').attr('disabled', 'disabled');
				rdQuery.UpdatePageFilename(cmspage.guid,jQuery('#filenameform .filename').val(),function(strFilename){
					if(strFilename == jQuery('#filenameform .filename').val()){
						setTimeout(function(){
							jQuery('#filenameform .savefilename').val('Done');
						},1000);
						setTimeout(function(){
							jQuery('#filenameform .savefilename').removeClass('saving-req').val('Save');
							jQuery('#filenameform .savefilename').blur().removeAttr('disabled');
						},3000);
					}
				});
				return false;
			}
		});
		
		// save on pressing enter
		jQuery("#filenameform").bind("keypress", function(e) {
             if (e.keyCode == 13) {
                 jQuery("#filename").blur();
				 jQuery(".savefilename").click();		 
                 return false;
            }
		});
		
		createdate = getDateFromCMSDate(data.createdate, false);
		changedate = getDateFromCMSDate(data.changedate, false);
		lockdate   = getDateFromCMSDate(data.lockdate, false);
		
		// set mailto values for sending an email regards this page
		strMailTo = 'mailto:' + data.lockuseremail + '?Subject=' + escape('CMS Page - "' + data.headline + '" || ID: ' + data.pageid);
		strMailTo += '&Body=' + escape('Hi, ..');
		
		// console.log(data);
		//cmspagestatus
				
		jQuery('span.user',cmspagecreator).html(data.createusername).attr('title',data.createusername);
		jQuery('span.time',cmspagecreator).html(createdate);
		jQuery('span.user',cmspagechanger).html(data.changeusername).attr('title',data.changeusername);
		jQuery('span.time',cmspagechanger).html(changedate);
		jQuery('span.id',cmspageid).html(data.pageid);
		jQuery('span.status',cmspagestatus).html(cmspage.status).addClass(cmspage.status);
		
		jQuery('span.user',cmspagelockinfo).html(data.lockusername);
		jQuery('span.time',cmspagelockinfo).html(lockdate);
		
		jQuery('a',cmspagelockinfo).attr('href',strMailTo);
		jQuery('a',cmspagelockinfo).attr('title','Send an email to: '+data.lockusername);
		jQuery(cmspagelockinfo).show();

		// update page modification date in stf field if necessary
		if(jQuery('#pagemoddate').length > 0){
			$pageDates = jQuery('#pagemoddate');
			// $pageDates.show();
			$latestModDate = $pageDates.find('strong.inf').html();
			$cachedModDate = $pageDates.find('strong.stf').html();
			
			if(cmspage.status!='WaitingForRelease'){
				// console.log(cmspage.status);
				if(cmspage.status=='Released' || jQuery('#pageInfoChanged .user').html()==cmsglobals.session.strActiveUserUsername){
					// console.log(jQuery('#pageInfoStatus .status').html());	
					// console.log(cmsglobals.session.strActiveUserUsername);
					if($latestModDate!=$cachedModDate){
						$pageDates.show();
						// $pageDates.find('.spinner').show();
						rdQuery.UpdateTextElement(cmspage.guid, 'stf_pageModDate', '1', $latestModDate, function(data){
								$pageDates.find('.spinner').hide();
						});
					}
				}
			}
		}
		
		
		
		
	});
	// page filename
	if(typeof(cmspage.showfilename)!='undefined' && cmspage.showfilename==='true'){
		cmspagefilename.appendTo('#cmsmenu');
	}

	// adding page info
	cmspageinfowrap = jQuery('<div id="pageInfo"></div>');
	cmspageinfowrap.appendTo('#cmsmenu');
	cmspagecreator.appendTo('#cmsmenu #pageInfo');
	cmspagechanger.appendTo('#cmsmenu #pageInfo');
	cmspageid.appendTo('#cmsmenu #pageInfo');
	cmspagestatus.appendTo('#cmsmenu #pageInfo');
	
	cmspagelockinfo.appendTo('#cmstoolbar div.pagesettings table td.first');
	
	jQuery('#cmstoolbar').addClass('loaded');
	
	// more page info 
	// cmspageinfomorewrap = jQuery('<div id="pageInfoMore"><div id="pageInfoMoreToggle">more<span></span></div><div id="pageInfoMorePanel"></div></div>');
	// cmspageinfomorewrap.appendTo('#cmsmenu');
	
	var rdQueryLoadingPanel = (function() {
		var show = function() {
			jQuery($rdQueryLoadingPanel).dialog({
				closeOnEscape: false,
				dialogClass: 'rdQueryDialog',
				height: 200,
				width: 300,
				modal: true
				});
		};
		var loadSettings = function(){
			// add CSS 
			try {
				// add link element to head and reference CSS
				// show();
			}
			catch ( e ) {
				alert ( e );
			}	
		};
		return  { // Everything that is returned in this object literal will be public
		show: show,
		init: function() {
			loadSettings();
		}		
	};
})(); // Invoke the function creating a closure and assign the returned object literal
	
	
	
	if(jQuery('#linkGuid').length > 0){
		jQuery('#linkGuid').click(function () {
			rdQuery.GetStructureElementGuidByElementName('list_nav', '82574330DF3044939F6B00F7A17D88E5', function(data){
			});
		});
	}
	
	
	
	
	
	// make the whole openclose button clickable
	if(jQuery('#rdopenclose').length > 0){
		jQuery('#rdopenclose').click(function () {
			targetUrl = '';
			$allArgs = jQuery('#rdopenclose script').html();
			$allArgs = $allArgs.split(',');
			jQuery($allArgs).each(function(i,el) {
				// save page
				if(el.indexOf('PreviewHandler.ashx')!=-1){
					targetUrl = el.split('"')[1];
				}
				// edit page
				if(el.indexOf('RDStartAspSession.asp')!=-1){
					targetUrl = el.split('"')[1];
				}
			});
			if(targetUrl==''){
				jQuery(this).unbind('click');
			}else{
				window.location.href = targetUrl;
			}
		});
	}
	
	
	if (jQuery('.fn_rdquery_delete').length > 0){
		jQuery('.fn_rdquery_delete').each(function(i,el) {
			jQuery(this).click(function(e) {
				var $deleteBtn = jQuery(this);
				e.preventDefault();
				//Check if current lang variant is the domestic site
				var deleteMsg = "Are you sure you want to delete this?";
				var strLanguageVariant = rdQuery.vars.strLanguageVariant;
				//TODO: potentially different outside of dev
				var mainLanguage = 'ENG'; 
				if (strLanguageVariant == mainLanguage) {
					//Want to delete all pages
					strLanguageVariant = '';
					deleteMsg += " It will be deleted in all language variants.";
				}
				var toDelete = confirm(deleteMsg);
				var strPageGuid = $deleteBtn.attr('rel');
				if(toDelete) {
					jQuery(this).unbind('click');
					var $rdblock = jQuery('#rdblock' + strPageGuid);
					$rdblock.addClass('reddot-hover-delete-clicked');
					$deleteBtn.text('deleting...');
					rdQuery.DeleteCurrentPageInVariants(strPageGuid, strLanguageVariant, false, function(data){
						var _data = jQuery(data).text();
						if(_data == "") {
							if(data.indexOf("#RDError15805") != -1) {
								alert("You do not have authorization to delete this page");	
								$deleteBtn.remove();
							}
						}
						else {
							$deleteBtn.text('deleted');
							$rdblock.fadeOut('slow',function(){
								jQuery(this).remove();
							});
						}
					});				
				}
			});
		});
	}
	
	
	if (jQuery('.fn_rdquery_add').length > 0){
		jQuery('.fn_rdquery_add').each(function(i,el) {
			jQuery(this).click(function(e) {
				$addBtn = jQuery(this);
				e.preventDefault();
				var params = $addBtn.attr('title').split(';'),
					i= params.length,
					json = {param: {}},
					param, k, v;
				while (i--)
				{
					param = params[i].split(':');
					k = jQuery.trim(param[0]);
					v = jQuery.trim(param[1]);
					if (k.length > 0 && v.length > 0)
					{
						json.param[k] = v;
					}
				}
				obj = jQuery.toJSON(json);
				jsonObj = jQuery.parseJSON(obj);
				userBlockTitle = prompt('Please enter a sorting title','Enter block title here');
				if((userBlockTitle=='null' || userBlockTitle == null) || userBlockTitle == 'Enter block title here'){
					alert('A sorting title is required. Please try again.');
					return false;
				}
				$addBtn.text('adding...');
				blockTitle = userBlockTitle.replace(/&/g,"&amp;").replace(/"/g,"&quot;") + ' | TEMPLATE: ' + jsonObj.param.title
				
				// see if it's a GUID (contains no .) or is a object (always contains a .)
				if(jsonObj.param.contentclassguid.indexOf('.') != -1){
					// use eval to read GUID from global list
					jsonObj.param.contentclassguid = eval(jsonObj.param.contentclassguid);
				}
				// see if it's a GUID (contains no .) or is a object (always contains a .)
				if(jsonObj.param.pageguid.indexOf('.') != -1){
					// use eval to read GUID from global list
					jsonObj.param.pageguid = eval(jsonObj.param.pageguid);
				}

				$rdQueryLoadingPanel.html($rdQueryLoadingMsg); 			
				rdQueryLoadingPanel.show();
				rdQuery.CreatePageInContainer(blockTitle, jsonObj.param.contentclassguid, jsonObj.param.targetelement, jsonObj.param.pageguid, function(data){
					$addBtn.text('added');
					// add dialog to enter title - Later Phase
					// maybe allow dialog also to select content classes? - Later Phase
				});	
			});
		});
	}
	
	
});

var createAndConnectPageToContainer = function(strPageHeadline, strContentClassGuid, strElName, strPageGuid){
	// jQuery('.RD_LoadingPanel').css('display','block');
	// rdQueryLoadingPanel();
	
	// var $rdQueryLoadingPanel = jQuery('<div id="rdQueryLoadingPanel">Just a moment</div>').hide().appendTo('body');
	// rdQueryLoadingPanel.init();
	rdQuery.CreatePageInContainer(strPageHeadline, strContentClassGuid, strElName, strPageGuid, function(data){
		
	});
}