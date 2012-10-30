# OpenText enhancements with the rdQuery Framework

Release date: 2009-06-03

First publication to Git: 2012-10-25

Current version: 1.0

Website: http://reddotcmsblog.com

### Requirements
 * jQuery and jQuery UI (referenced from Google CDN)
 * .net Framework running 

For the webservices connected via AJAX you also need to set:

    <system.web>
      <customErrors mode="Off"/>
      <webServices>
        <protocols>
          <add name="HttpGet"/>
          <add name="HttpPost"/>
        </protocols>
      </webServices>
    </system.web>

Inside the <OTCMS install folder>/ASP/web.config

### Integration and usage of RQL JS plugin
There are two static plugin components used for this project to customise and enhance the usability of the CMS. This chapter describes both plugins, their usage and integration points

### RQLJS - rdQuery Plugin
The RQL JS plugin is used to create customised red dots and the custom toolbar on top of each page which allow minimising the number of clicks a user has to do to achieve certain CMS tasks. The plugin is a bridging component written in Javascript, it communicates with the RedDot Query Language API via XML AJAX calls.
 
The plugin files are located in the application folder under /PlugIns/<ProjectName>/rqljs



### CMS integration point - Content Class location
#### "SYSTEM - rdQuery toolbar"
The content class "SYSTEM - rdQuery toolbar" is the only integration point within the CMS project. Within this file are all references to files in the PlugIns folder. The instance of this template is integrated into the "Home" page and referenced from every foundation page within the project.
#### "SYSTEM - Global content class guids"
This content class controls the mapping of GUIDs to content class names in a JSON object
#### "SYSTEM - Global custom red dots"
This content class controls the list of main content blocks available in the main content container in every content page that references the instance of this template.
#### "SYSTEM - Global custom red dots context"
Same as above, just for new content blocks in a different column



### Files, folders and purpose
 * **ToolbarDemo.zip** - THIS IS IT. The OpenText demo CMS project that shows you how to use the plugin.
 * **ProjectName/customStyleAndJS/edit.js** - This file allows for CMS specific Javascript actions within your CMS project
 * **ProjectName/customStyleAndJS/edit.css** - This file allows for CMS specific CSS rules within your CMS project
 * **ProjectName/rqljs/css** - This folder contains CSS files to style the custom reddots and the toolbar within CMS content pages.
 * **ProjectName/rqljs/rdQuery.js** - This is the core of the plugin, it holds all methods to the API as JavaScript code. JavaScript callbacks are used to run scripts in sequences and not synchronous. This file doesn't have an impact on styling or layout or project specific code fragments AT ALL. It is purely RQL functional code and nothing else should go in here. If you need a new functionality and the RQL code needs to be written from scratch, then put this in here.
 * **ProjectName/rqljs/rdViews.js** - This is the project specific file that chains certain methods from "rdQuery.js" together in order to achieve shortcuts for CMS authors. If you have to make any changes to the way the code is used and views on the API are executed, this is the file to change. If you want to combine new functionality with a visual interface (dialog, custom reddots, automatic updates of elements) then this is the file to work on.
 * **readme.txt** - To get the plugin to work, a few minor changes to a web.config are required. These are documented in here. Later on this file should contain a broader documentation on how to set things up.

### Development and debugging
To edit this file you can develop and test it on a development environment. 
Use Firefox' Firebug extension and test the result in FF and IE. 
Then simply commit it to a code repository of your choosing and deploy to UAT and then PROD.

### Disclaimer
 * this project was an idea from back in 2008/2009 and has been refined over the last 3 years
 * I am not affiliated with OpenText and this Software is published by myself and has nothing to do with my employer 
 * This software comes "as is" and without any guarantee to work and/or not break anything

### DISCLAIMER OF WARRANTY
The Software is provided "AS IS" and "WITH ALL FAULTS," without warranty of any kind, including without limitation the warranties of merchantability, fitness for a particular purpose and non-infringement. The Developer makes no warranty that the Software is free of defects or is suitable for any particular purpose. In no event shall the Developer be responsible for loss or damages arising from the installation or use of the Software, including but not limited to any indirect, punitive, special, incidental or consequential damages of any character including, without limitation, damages for loss of goodwill, work stoppage, computer failure or malfunction, or any and all other commercial damages or losses. The entire risk as to the quality and performance of the Software is borne by you. Should the Software prove defective, you and not the Developer assume the entire cost of any service and repair.
(YAY for lawyer land !)
 