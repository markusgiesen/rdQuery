/*
	rdQuery Framework, created by Markus Giesen
	
	createDate: 	2007-09-26
	lastChange:		2011-07-21
	
	This framework requires jQuery to work
*/
// v10: strWebserviceRql: 'http://aumel6531/cms/Navigation/Services/RqlService.asmx',
// v7:  strWebserviceRql: '/cms/Services/RqlService.asmx/ExecuteString',
/*
	//to get session details include this in your template _before_ you include this script:
	
    <script type="text/javascript">
		// this is only required for v7.5
        var cmspage = {
          'guid': '82574330DF3044939F6B00F7A17D88E5'
        };
    </script>
    <script type="text/javascript">
    var cmsglobals = {
      'session': {
        'strLoginGuid':       '4CC4AAB70D7E4B148842A3D8CFE9DE4A',
        'strSessionKey':      '4CC4AAB70D7E4B148842A3D8CFE9DE4A',
        'strProjectGuid':     'EBB3767E838B44C1A56C101A3B755A88',
        'strLanguageVariant': 'ENG'
      }
    };
</script>
 */

pluginFolder = "/cms/plugins/ProjectName/rqljs/";


// Here goes the actual code
var rdQuery = (function() {

		// initial variables 
		var vars = {
			strRql: '',
			strWebserviceRql: '/cms/Navigation/Services/RqlService.asmx/ExecuteString',
			strLoginGuid: cmsglobals.session.strLoginGuid,
			strSessionKey: cmsglobals.session.strSessionKey,
			strProjectGuid: cmsglobals.session.strProjectGuid,
			strLanguageVariant: cmsglobals.session.strLanguageVariant
		};
	
		// MG: this function is required to get returned strings converted to Xml DOM objects
		var stringToDOM = function (varString) {
			if(typeof DOMParser != "undefined"){
				return (new DOMParser).parseFromString(varString, "text/xml");
			}else if(typeof ActiveXObject != "undefined"){
				var parser = new ActiveXObject("Microsoft.XMLDOM");	    
				parser.async = "false"; 
				parser.loadXML(varString);
				return parser;
			}else if (typeof XMLHttpRequest != "undefined") {
				var req = new XMLHttpRequest;
				req.open("GET", "data:" + (contentType || "application/xml") + 
										   ";charset=utf-8," + encodeURIComponent(str), false);
				if (req.overrideMimeType) {
					req.overrideMimeType(contentType);
				}
				req.send(null);
				return req.responseXML;
			}
		};
		
		
				
		var CopyAndConnectPageToContainer = function(strPageGuid, strContainerGuid, strCopyMode)
		{
			/* 	strPageGuid: page which will be copied
				strContainerGuid: GUID of the container to copy the page into
				strCopyMode, 
					50: "NO - Would you like to also copy the complete project tree that follows from this page?"
						"Copy element contents instead of referencing",
						"Adopt authorizations of link elements",
						"Adopt authorizations of other elements"
						NO email
			*/
		
			// no copymode no go..
			if(strCopyMode!="")
			{
				// no pageguid no go..
				if (strPageGuid != "" || strContainerGuid != "")
				{			
					// RQL to link a page to a container
					sXmlData = '<LINK action="assign" guid="' + strContainerGuid + '" reddotcacheguid="">';
					sXmlData += '<PAGE action="copy" guid="' + strPageGuid + '" copymode="' + strCopyMode + '" />';
					sXmlData += '</LINK>';
					return sXmlData;
				}
				return "no pageGUID, containerGUID given";
			}
			return "no copymode given";
		};
		/*
		var CopyAndConnectPageInClipboardToContainer = function(strContainerName, strPageGuid) {
			// strPageGuid is the page the user is seeing at the moment, for reload after successful connect
			
			// functionality
			// get page in clipboard
			// get container GUID based on container element name
				// GetStructureElementGuidByElementName = function (strElName, strPageGuid, callback)
			// 
			return 'sessionkey or loginguid missing';
			// <LINK action="assign" guid="4655D001478E476DBBF18864D274192D" reddotcacheguid="">
			// <PAGE action="copy" guid="53503AB32B5D4DDD9114C003314BE367" copymode="50" /></LINK>
		};
		
		var CopyAndConnectPageToContainer = function(strContainerName, strPageGuid, strTargetPageGuid, strCopyMode) {
			// strPageGuid is the page to copy and connect
			// <LINK action="assign" guid="4655D001478E476DBBF18864D274192D" reddotcacheguid="">
			// <PAGE action="copy" guid="53503AB32B5D4DDD9114C003314BE367" copymode="50" /></LINK>
			/* strCopyMode, 
					50: "NO - Would you like to also copy the complete project tree that follows from this page?"
						"Copy element contents instead of referencing",
						"Adopt authorizations of link elements",
						"Adopt authorizations of other elements"
						NO email
			
			
			// functionality
			// get page in clipboard
			// get container GUID based on container element name
			GetStructureElementGuidByElementName = function (strContainerName, strTargetPageGuid, guiddata){
				strEltGuid = guiddata;			
				// Skript will only be executed if elementGUID exist and a elt type is entered
				if (strEltGuid != "")
				{
					// alert(xmlFile);
					var strReturn = "";
					rql = CreateRql(xmlFile, '', '', '1');
					ExecuteRql(rql,function(data) { 
						var xml = jQuery(data).text(); // xml response is actually the encoded cdata of the root element
						// find the XML element and return GUID
						var elt = FilterDataFromXML(xml,'elt');
						strReturn = jQuery(elt).text();
						if(typeof(strReturn)==="undefined"){
							strReturn = jQuery(elt).attr('guid');
						}
						// console.log(strReturn);
						callback(strReturn);
						//return strReturn;
					});
				}
				return "no element guid or element type given";
				// <LINK action="assign" guid="4655D001478E476DBBF18864D274192D" reddotcacheguid="">
				// <PAGE action="copy" guid="53503AB32B5D4DDD9114C003314BE367" copymode="50" /></LINK>
			};
			// 
			return 'sessionkey or loginguid missing';
		};
		
		// <LINK action="assign" guid="4655D001478E476DBBF18864D274192D" reddotcacheguid="">
			// <PAGE action="copy" guid="53503AB32B5D4DDD9114C003314BE367" copymode="50" /></LINK>
		*/
		var CreateRql = function(strRql, strUserName, strLanguageVar, strFormat) {
			if(vars.strSessionKey != "" && vars.strLoginGuid != "") {
				var strTag = '<IODATA ';
				strTag += ' sessionkey="' + vars.strSessionKey + '" ';
				strTag += ' loginguid="' + vars.strLoginGuid + '" ';
				
				if(strFormat!="")
				{
					strTag += 'format="' + strFormat + '" ';
				}
				if(strUserName!="")
				{
					strTag += 'user="' + strUserName + '" ';
				}
				if(strLanguageVar!="")
				{
					strTag += 'dialoglanguageid="' + strLanguageVar + '" ';
				}
				strTag += '>';
				strTag += strRql;
				strTag += '</IODATA>';
				return strTag;
			}
			return 'sessionkey or loginguid missing';

		};
		
		var ExecuteRql = function(strRql,callback) {
			jQuery.ajax({
				async: true,
				type: "POST",
				url: vars.strWebserviceRql,
				data: { command: strRql },
				dataType: "xml",
				error: function(xhr, ajaxOptions, thrownError) {
					callback(xhr.responseText);
				},
				success: function(data) {
					callback(data);
				}
			});
		};
		
		
		var FilterDataFromXML = function(xml,filter) {
			// var strFilteredData = jQuery('<div style="display:none;" id="hiddenXML">').append(jQuery(xml).clone()).remove().find(filter).html();

			jQuery('<div style="display:none;" id="hiddenXML">' + xml + '</div>').appendTo('body');
			// console.log(jQuery('#hiddenXML'));
			
			// find the XML elements and return them
			var strFilteredData = jQuery('#hiddenXML').find(filter);
			// remove the XML from page HTML
			jQuery('#hiddenXML').remove();
			return strFilteredData;
		};

		var LoadPageFilename = function(strPageGuid)
		{
			// no pageguid no go..
			if (strPageGuid != "")
			{			
			    // RQL to get extended page info
			    sXmlData =	'<PAGE action="load" guid="' + strPageGuid + '" parentguid="" actionflag="131072" editlinkguid=""/>';
				return sXmlData;
			}
			return "no pageGUID given";
		};
		
		var LoadPageInfoExtended = function(strPageGuid)
		{
			// no pageguid no go..
			if (strPageGuid != "")
			{			
			    // RQL to get extended page info
			    sXmlData =	'<PAGE guid="' + strPageGuid + '" action="load" option="extendedinfo" />';
				return sXmlData;
			}
			return "no pageGUID given";
		};
		
		var SavePageFilename = function(strPageGuid,strPageFilename) {
			// no pageguid no go..
			if (strPageGuid != "")
			{			
			    // RQL to get extended page info
//			    sXmlData =	'<PAGE action="save" translationmode="0" guid="' + strPageGuid + '" editlinkguid="" name="' + strPageFilename + '" headline="xxxx My new page" />';
				sXmlData =	'<PAGE action="save" translationmode="0" guid="' + strPageGuid + '" name="' + strPageFilename + '" />';
				return sXmlData;
			}
			return "no pageGUID given";
		};

		
		var LoadPageContentElements = function(strPageGuid)
		{
			// strElTypes to show is "content" or "structure"
			if (strPageGuid != "")
			{			
			    // RQL to get elements of a page 
			    sXmlData =	'<PAGE guid="' + strPageGuid + '"><ELEMENTS action="load" /></PAGE>';
				return sXmlData;
			}
			return "no pageGUID given";
		};
		var LoadPageStructureElements = function(strPageGuid)
		{
			// strElTypes to show is "content" or "structure"
			if (strPageGuid != "")
			{			
			    // RQL to get elements of a page 
			    sXmlData =	'<PAGE guid="' + strPageGuid + '"><LINKS action="load" /></PAGE>';
				return sXmlData;
			}
			return "no pageGUID given";
		};
		
		var SaveTextElement = function(strEltGuid,strElType,strData) {
			// strElTypes to show is "content" or "structure"
			if (strEltGuid != "")
			{			
				if (strElType == "32")
				{			
			    // RQL to set text elements of a page 
			    sXmlData =	'<ELT action="save" guid="'+strEltGuid+'" type="'+strElType+'"><![CDATA[' + strData + ']]></ELT>';
				}else if (strElType == "1"){
				// setting standard field value of an element
				sXmlData =	'<ELEMENTS translationmode="0" action="save" reddotcacheguid="">';
					sXmlData +=	'<ELT action="save" guid="'+strEltGuid+'" extendedinfo="" type="'+strElType+'" value="' + strData + '"></ELT>';
				sXmlData +=	'</ELEMENTS>';
				}
				return sXmlData;
			}
			return "no eltGUID given";
		};
		
		var GetKeywordsByPageGuid = function (strPageGuid, callback)
		{
			if (strPageGuid != "")
			{			
			    // RQL to list keywords for a page by PageGuid
			    var xmlFile = '<PROJECT sessionkey="' + vars.strSessionKey + '"><PAGE guid="' + strPageGuid + '"><KEYWORDS action="load"/></PAGE></PROJECT>';
				var strKeywords = "";
				rql = CreateRql(xmlFile, '', '', '');
				ExecuteRql(rql,function(data) { 
					var xml = jQuery(data).text(); // xml response is actually the encoded cdata of the root element
					// Data extract method
					strKeywords = FilterDataFromXML(xml,'keyword');
					callback(strKeywords);
					return false;
				});
			}
			return "no pageGUID given";
		};
		
		var ListKeywordsByCategoryGuid = function (strCatGuid, callback)
		{
			if (strCatGuid != "")
			{			
			    // RQL to list keywords by CategoryGuid
			    var xmlFile =	'<PROJECT><CATEGORY guid="'+strCatGuid+'"><KEYWORDS action="load"/></CATEGORY></PROJECT>';
				var strKeywords = "";
				rql = CreateRql(xmlFile, '', '', '');
				ExecuteRql(rql,function(data) { 
					var xml = jQuery(data).text(); // xml response is actually the encoded cdata of the root element
					// Data extract method
					strKeywords = FilterDataFromXML(xml,'keyword');
					callback(strKeywords);
				});
			}
			return "no categoryGUID given";
		};
		
		UpdateKeywordsForPage = function(arrPageKeywords,arrPageKeywordsToRemove,strKeywordGuidToSave,strPageGuid,callback)
		{
		
			// check if there is enough data to run the update
			if(strPageGuid == '') {
				return 'no pageGuid given, can not update page without GUID';
			}
			if(strKeywordGuidToSave == '' && arrPageKeywords.length == 0) {
				return 'nothing to save for this page';
			}
			
			var strKeywords = '';
			
			// check if there is data in the arrays
			if(strKeywordGuidToSave != '' && arrPageKeywords.length > 0) {
				// check if keyword is already in page
				if(jQuery.inArray(strKeywordGuidToSave,arrPageKeywords) == -1) {
					// keyword is not in page yet 
					strKeywords += '<KEYWORD guid="' + strKeywordGuidToSave + '" changed="1" />';
				}else{
					// keyword is already in page
					strKeywords += '<KEYWORD guid="' + strKeywordGuidToSave + '" changed="0" />';
				}
			}
			// else check if keywords need to be deleted
			if((arrPageKeywords.length > 0) || (arrPageKeywordsToRemove.length > 0)) {
				// compare current assigned keywords to array with guids to delete
				jQuery(arrPageKeywords).each(function(i, val){
					// if this GUID is in delete array
					if(jQuery.inArray(val,arrPageKeywordsToRemove) != -1) {
						// mark it to delete this keyword 
						strKeywords += '<KEYWORD guid="' + val + '" changed="1" delete="1" />';
					}else {
						// leave this keyword unchanged
						strKeywords += '<KEYWORD guid="' + val + '" changed="0" />';						
					}
				});
			}
			var xmlFile = '';
			if(strKeywords!=''){
				xmlFile = '<PROJECT sessionkey="' + vars.strSessionKey + '"><PAGE guid="' + strPageGuid + '" action="assign"><KEYWORDS>' + strKeywords + '</KEYWORDS></PAGE></PROJECT>';
			}else {
				return 'something is wrong, the keyword string is empty';
			}
			rql = CreateRql(xmlFile, '', '', '');
			// return false;
			ExecuteRql(rql,function(data) { 
				callback(data);
			});
		};
		
		
		var GetContentElementGuidByElementName = function (strElName, strPageGuid, callback)
		{
			// Script will only be executed if PageGUID and element name exist
			if (strElName != "" && strPageGuid != "")
			{
				var xmlFile = LoadPageContentElements(strPageGuid);
				// alert(xmlFile);
				var strElGuid = "";
				rql = CreateRql(xmlFile, '', '', '');
				ExecuteRql(rql,function(data) { 
					var xml = jQuery(data).text(); // xml response is actually the encoded cdata of the root element

					// find the XML element and return GUID
					var elt = FilterDataFromXML(xml,'element[eltname="'+strElName+'"]');
					strElGuid = jQuery(elt).attr('guid');
					
					// return value
					callback(strElGuid);					
				});
			}
			return "no element name or xml file given";
		};
		
		
		var GetStructureElementGuidByElementName = function (strElName, strPageGuid, callback)
		{
			// Skript will only be executed if PageGUID and element name exist
			if (strElName != "" && strPageGuid != "")
			{
				var xmlFile = LoadPageStructureElements(strPageGuid);
				// alert(xmlFile);
				var strElGuid = "";
				rql = CreateRql(xmlFile, '', '', '');
				ExecuteRql(rql,function(data) { 
					var xml = jQuery(data).text(); // xml response is actually the encoded cdata of the root element

					// find the XML element and return GUID
					var elt = FilterDataFromXML(xml,'link[eltname="'+strElName+'"]');
					strElGuid = jQuery(elt).attr('guid');
					
					// return value
					callback(strElGuid);					
				});
			}
			return "no element name or xml file given";
		};
		
		var GetPageInformation = function (strPageGuid, callback)
		{
			// Skript will only be executed if PageGUID exist
			if (strPageGuid != "")
			{
				var xmlFile = LoadPageFilename(strPageGuid);
				// alert(xmlFile);
				var strFilename = "";
				rql = CreateRql(xmlFile, '', '', '');
				ExecuteRql(rql,function(data) { 
					var xml = jQuery(data).text(); // xml response is actually the encoded cdata of the root element
					// find the XML element and return GUID
					var elt = FilterDataFromXML(xml,'page');
					strFilename = jQuery(elt).attr('name');
					if(typeof(strFilename)==="undefined" || strFilename==""){
						strFilename = jQuery(elt).attr('id');
					}
					// console.log(elt);
					var pageinfo = {
						'strFilename'		: strFilename,
						'createusername'	: jQuery(elt).attr('createusername'),
						'createdate'		: jQuery(elt).attr('createdate'),
						'changeusername'	: jQuery(elt).attr('changeusername'),
						'changedate'		: jQuery(elt).attr('changedate'),
						'headline'			: jQuery(elt).attr('headline'),
						'lockusername'		: jQuery(elt).attr('lockusername'),
						'lockuseremail'		: jQuery(elt).attr('lockuseremail'),
						'lockdate'			: jQuery(elt).attr('lockdate'),
						'pageid'			: jQuery(elt).attr('id'),
						'releaseuserguid'	: jQuery(elt).attr('releaseuserguid'),
						'releaseusername'	: jQuery(elt).attr('releaseusername'),
						'releasedate'		: jQuery(elt).attr('releasedate')
					}
					callback(pageinfo);					
				});
			}
			return "no element name or xml file given";
		};
		
		var GetContentClassesByFolderGuid = function(strFolderGuid,strTreeType,strTreeDescent,strTreeParentGuid, callback){
			// Skript will only be executed if GUIDs exist
			// this can only be executed with admin access
			if(strFolderGuid == "") {
				return "no folder GUID given";
			}
			var xmlFile = '<TREESEGMENT type="' + strTreeType + '" action="load" guid="' + strFolderGuid + '" descent="' + strTreeDescent + '" parentguid="' + strTreeParentGuid + '" />';
			// alert(xmlFile);
			rql = CreateRql(xmlFile, '', vars.strLanguageVariant, '');

			ExecuteRql(rql,function(data) { 
				var xml = jQuery(data).text(); // xml response is actually the encoded cdata of the root element
				callback(data);
			});
		};
		
		var GetContentClassNodesByContentClassGuid = function(strContentClassGuid,strTreeType,strTreeDescent,strTreeParentGuid, callback){
			// Skript will only be executed if GUIDs exist
			// this can only be executed with admin access
			if(strContentClassGuid == "") {
				return "no folder GUID given";
			}
			var xmlFile = '<TREESEGMENT type="' + strTreeType + '" action="load" guid="' + strContentClassGuid + '" descent="' + strTreeDescent + '" parentguid="' + strTreeParentGuid + '" />';
			// alert(xmlFile);
			rql = CreateRql(xmlFile, '', vars.strLanguageVariant, '');

			ExecuteRql(rql,function(data) { 
				var xml = jQuery(data).text(); // xml response is actually the encoded cdata of the root element
				callback(data);
			});
		};
		
		
		
		var GetInstancesByContentClassGuid = function(strContentClassGuid,strTreeType,strTreeDescent,strTreeParentGuid, callback) {
			// Skript will only be executed if GUIDs exist
			// this can only be executed with admin access
			if(strContentClassGuid == "") {
				return "no content class GUID given";
			}
			var xmlFile = '<TREESEGMENT type="' + strTreeType + '" action="load" guid="' + strContentClassGuid + '" descent="' + strTreeDescent + '" parentguid="' + strTreeParentGuid + '" />';
			// alert(xmlFile);
			rql = CreateRql(xmlFile, '', vars.strLanguageVariant, '');

			ExecuteRql(rql,function(data) { 
				var xml = jQuery(data).text(); // xml response is actually the encoded cdata of the root element
				callback(data);
			});
		};
		
		var CreateAndConnectPage = function (strPageHeadline, strContentClassGuid, strLinkGuid, callback)
		{
			// Skript will only be executed if GUIDs exist
			if(strContentClassGuid == "") {
				return "no content class GUID given";
			}
			if(strLinkGuid == "") {
				return "no link GUID given";
			}

			var xmlFile = '<LINK action="assign" guid="' + strLinkGuid + '">';
			xmlFile += '<PAGE action="addnew" templateguid="' + strContentClassGuid + '" headline="' + strPageHeadline + '"/>';
			xmlFile += '</LINK>';
			// alert(xmlFile);
			rql = CreateRql(xmlFile, '', '', '');

			ExecuteRql(rql,function(data) { 
				var xml = jQuery(data).text(); // xml response is actually the encoded cdata of the root element
				callback(data);
			});
		};
		
		var CreatePageInContainer = function (strPageHeadline, strContentClassGuid, strElName, strPageGuid, callback)
		{
			GetStructureElementGuidByElementName(strElName, strPageGuid, function(guiddata){
				strLinkGuid = guiddata;
				rdQuery.CreateAndConnectPage(strPageHeadline,strContentClassGuid,strLinkGuid,function(data) {
					var xml = jQuery(data).text(); // xml response is actually the encoded cdata of the root element
					// Data extract method
					var strPage = rdQuery.FilterDataFromXML(xml,'page');
					var strNewPageGuid = ""; // FilterDataFromXML(xml,'element[eltname="'+strElName+'"]');
					strNewPageGuid = jQuery(strPage).attr('guid');
					openNewPage=true;
					if(openNewPage==false){
						// if the new page isn't supposed to be opened, just reload the current page in edit mode
						strPageGuid = cmspage.guid;
					}
					var newhref = '/cms/webclient/PreviewHandler.ashx?Action=RedDot&Mode=2&projectguid=' + rdQuery.vars.strProjectGuid + '&pageguid=' + strPageGuid;
					newhref += "&EditPageGUID=" + strNewPageGuid + "&";
					newhref += "LinkGUID=" + strLinkGuid;
					// console.log(newhref);
					// return false;
					window.location.href = newhref;
				});
			});
		}; 
		
		var DeleteCurrentPage = function (strPageGuid, bReload, callback)
		{
			return DeleteCurrentPageInVariants(strPageGuid, "", bReload, callback);
		};

		var DeleteCurrentPageInVariants = function (strPageGuid, strLanguageVariantList, bReload, callback)
		{
			if (strPageGuid == "") {
				return "no page GUID given";
			}
			var xmlFile = '<PAGE action="delete" guid="' + strPageGuid + '">';

			//Get specific variants. Empty will delete from all
			if (strLanguageVariantList != "") {
				var variants = strLanguageVariantList.split(",");
				var variantsXml = "";
				for (var i = 0; i < variants.length; i++) {
					var variant = variants[i];
					variantsXml += '<LANGUAGEVARIANT language="' + variant + '"/>'
				}
				variantsXml = '<LANGUAGEVARIANTS>' + variantsXml + '</LANGUAGEVARIANTS>'
				xmlFile += variantsXml;
			}
			xmlFile += '</PAGE>';

			rql = CreateRql(xmlFile, '', '', '');
			ExecuteRql(rql, function (data) {
				var xml = jQuery(data).text();
				openNewPage = true;
				strPageGuid = cmspage.guid;
				var newhref = '/cms/webclient/PreviewHandler.ashx?Action=RedDot&Mode=2&projectguid=' + rdQuery.vars.strProjectGuid + '&pageguid=' + strPageGuid;
				newhref += "&EditPageGUID=" + strPageGuid + "&";
				newhref += "Opener=1";
				if (bReload) {
					window.location.href = newhref;
				}
				callback(data);
			});
		};

		
		var UpdatePageFilename = function (strPageGuid, strPageFilename, callback)
		{
			// Skript will only be executed if PageGUID exist and a filename is entered
			if (strPageGuid != "" && strPageFilename != "")
			{
				var xmlFile = SavePageFilename(strPageGuid,strPageFilename);
				// alert(xmlFile);
				var strFilename = "";
				rql = CreateRql(xmlFile, '', '', '');
				ExecuteRql(rql,function(data) { 
					var xml = jQuery(data).text(); // xml response is actually the encoded cdata of the root element
					// find the XML element and return GUID
					var elt = FilterDataFromXML(xml,'page');
					strFilename = jQuery(elt).attr('name');
					if(typeof(strFilename)==="undefined"){
						strFilename = jQuery(elt).attr('id');
					}
					// console.log(strFilename);
					callback(strFilename);
					//return strFilename;
				});
			}
			return "no page guid or filename given";
		};
		
		var UpdateTextElement = function (strPageGuid, strElName, strElType, strData, callback)
		{
			GetContentElementGuidByElementName(strElName, strPageGuid, function(guiddata){
				
				strEltGuid = guiddata;			
				// Skript will only be executed if elementGUID exist and a elt type is entered
				if (strEltGuid != "" && strElType != "")
				{
					var xmlFile = SaveTextElement(strEltGuid,strElType,strData);
					// alert(xmlFile);
					var strReturn = "";
					rql = CreateRql(xmlFile, '', '', '1');
					ExecuteRql(rql,function(data) { 
						var xml = jQuery(data).text(); // xml response is actually the encoded cdata of the root element
						// find the XML element and return GUID
						var elt = FilterDataFromXML(xml,'elt');
						strReturn = jQuery(elt).text();
						if(typeof(strReturn)==="undefined"){
							strReturn = jQuery(elt).attr('guid');
						}
						// console.log(strReturn);
						callback(strReturn);
						//return strReturn;
					});
				}
				return "no element guid or element type given";
				
			});
		};
		
		/*/v10 URL
				./PreviewHandler.ashx?
				Action=RedDot&
				Mode=1&
				projectguid=530C3597681A4B03A83E3190E94BED40&
				editlinkguid=7AEF5CF8B8AD4C78B0F07CB5AFA11906&
				parentpageguid=&
				pageguid=FF909BAC787649FEBAD389F7F33DF719&
				targetcontainerguid=&
				containerpageguid=&
				projectvariantguid=EBB3767E838B44C1A56C101A3B755A88&
				languagevariantid=ENG&
				islink=1&
				foraspx=1&
				themepath=App_Themes/Standard&
				timestamp=634196442160781250
				
		//v7.5 URL
				/cms/ioRD.asp?
				Action=RedDot&
				Mode=1
				&projectguid=3596C6438F66434D882650D2631018EC&
				editlinkguid=7EF536FE88874E8AAC0393649FCBF1C7&
				parentpageguid=1AF0079A647E4221984ED009B6E881EB&
				pageguid=7582C8E03EAF425A8BFFC633E4547BF1&
				targetcontainerguid=8A32891B2CB34C9EAB4DE4B27F92A917&
				containerpageguid=1AF0079A647E4221984ED009B6E881EB&
				projectvariantguid=A0D117D20B4B46B98C3E7BFF40EB0607&
				languagevariantid=ENU&
				islink=2
		
		//v7.5 URL to edit
				/cms/ioRD.asp?
				Action=RedDot&amp;
				Mode=2&amp;
				ParentPageGUID=1AF0079A647E4221984ED009B6E881EB&amp;
				PageGUID=7582C8E03EAF425A8BFFC633E4547BF1&amp;
				TargetContainerGUID=8A32891B2CB34C9EAB4DE4B27F92A917&amp;
				ContainerPageGUID=1AF0079A647E4221984ED009B6E881EB&amp;
				EditPageGUID=1AF0079A647E4221984ED009B6E881EB&amp;
				LanguageVariantId=ENU&amp;
				projectvariantguid=A0D117D20B4B46B98C3E7BFF40EB0607&amp;
				LinkGUID=7EF536FE88874E8AAC0393649FCBF1C7&amp;
				EditLinkGUID=7EF536FE88874E8AAC0393649FCBF1C7&amp;
				Opener=1#CloseRedDot

		 */ 

		var loadSettings = function(){
			// add CSS 
			try {
				// add link element to head and reference CSS
				var tstamp = new Date().getTime();
				jQuery("head").append("<link>");
				css = jQuery("head").children(":last");
				css.attr({
				  rel:  "stylesheet",
				  type: "text/css",
				  href: pluginFolder + 'css/rdQuery.css?time=' + tstamp
				});
				// jQuery('html, body').animate({scrollTop:0}, 'fast');
			}
			catch ( e ) {
				alert ( e );
			}	
		};
					/*&
					&editlinkguid=&amp;
					parentpageguid=&
					targetcontainerguid=&
					containerpageguid=&
					projectvariantguid=EBB3767E838B44C1A56C101A3B755A88&
					languagevariantid=ENG&
					islink=1&
					foraspx=1&
					themepath=App_Themes/Standard&
					timestamp=634196442160781250';*/
								// return false;
								// console.log(strPageGuid);		
		
	return  { // Everything that is returned in this object literal will be public, if you only use a method within the scope above don't add it below!
		
		vars: vars,
		//CopyAndConnectPageInClipboardToContainer: CopyAndConnectPageInClipboardToContainer,
		FilterDataFromXML: FilterDataFromXML,
		GetContentClassesByFolderGuid: GetContentClassesByFolderGuid,
		GetContentClassNodesByContentClassGuid: GetContentClassNodesByContentClassGuid,
		GetInstancesByContentClassGuid: GetInstancesByContentClassGuid,
		GetPageInformation: GetPageInformation,
		GetStructureElementGuidByElementName: GetStructureElementGuidByElementName,
		GetKeywordsByPageGuid: GetKeywordsByPageGuid,
		ListKeywordsByCategoryGuid: ListKeywordsByCategoryGuid,
		UpdateKeywordsForPage: UpdateKeywordsForPage,
		CreateAndConnectPage: CreateAndConnectPage,
		CreatePageInContainer: CreatePageInContainer,
		DeleteCurrentPage: DeleteCurrentPage,
		DeleteCurrentPageInVariants: DeleteCurrentPageInVariants,
		UpdatePageFilename: UpdatePageFilename,
		UpdateTextElement: UpdateTextElement,
		init: function() {
			loadSettings();
		}
		
	};
})(); // Invoke the function creating a closure and assign the returned object literal

// these bits are a workaround because RedDot doesn't load document.ready when switching from SmartTree to SmartEdit
jQuery(document).ready(function() {
	if(typeof(rdQuery) != "undefined") { rdQuery.init(); }
});