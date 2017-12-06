/*
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
Copyright (c) 2014 Mozilla Corporation

Contributors:
Jeff Bryner jbryner@mozilla.com

*/

// helper functions
getSetting=function (settingKey){
	  //returns the value given a setting key
	  //makes server-side settings easier to 
	  //deploy than normal meteor --settings
	  var settingvalue = mozdefsettings.findOne({ key : settingKey }).value;
	  return settingvalue;
	};

AlertSortSettings = {};

AlertSortSettings.getSortParams = function(sortField, sortDirection) {
  var sortParams = [];
  
  var direction = sortDirection || 'asc';

  var field = sortField || 'ts';
  if (field === 'ts') {
	sortParams.push(['timestamp_sort', direction]);
	sortParams.push(['severity_sort', direction])
  } else if (field === 'sev') {
	sortParams.push(['severity_sort', direction]);
	sortParams.push(['category_sort', direction]);
  } else if (field === 'cat') {
	sortParams.push(['category_sort', sortDirection]);
	sortParams.push(['severity_sort', direction]);
  } 

  return sortParams;
}

AlertSortSettings.sortField = function() {
	return Router.current().params.sortField || 'ts';
  }
  
  AlertSortSettings.sortDirection = function() {
	return Router.current().params.sortDirection || 'asc';
  }
  
AlertSortSettings.toggleSortDirection = function(sortBy) {
  if (this.sortField() !== sortBy) {
	return 'asc';
  } else {
	if (this.sortDirection() === 'asc') {
	  return 'desc';
	} else {
	  return 'asc';
	}
  }
}
AlertSortSettings.getSortIconClass = function(element) {
	if (this.sortField() === element) {
	  return this.sortDirection() === "asc" ? 
		"fa fa-sort-asc" : "fa fa-sort-desc";
	} else {
	  return "fa fa-sort";
	}
  }