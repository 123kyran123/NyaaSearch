/*
* Controller.js
* Contains all the functions for the webpage.
* communicates with the php files as well.
*
* Created by: Kyran
* Date: April 12th 2016
 */


//Initialize all variables
var options;
var tableList;
var groupFilters = [];
var episodeFilters = [];
var resolutionFilters = [];

var jsonResult;
var tableString;
var torrentType;
var groups = [];
var groupList = [];
var episodes = [];
var episodeList = [];
var resolutions = [];
var resolutionList = [];

//Function that gets the torrent list.
function crawl(){
	//Ajax call to Crawler.php
	//It receives a json array with torrents
	//Puts torrents in the table on homescreen
	$.ajax({
		type: "post",
		url: '../Functions/Crawler.php',
		data: "crawlNyaa=" + document.getElementById("link").value,
		dataType: 'html',
		error: function (jqXHR, exception) {
			var msg = '';
			if (jqXHR.status === 0) {
				msg = 'Not connect.\n Verify Network.';
			} else if (jqXHR.status == 404) {
				msg = 'Requested page not found. [404]';
			} else if (jqXHR.status == 500) {
				msg = 'Internal Server Error [500].';
			} else if (exception === 'parsererror') {
				msg = 'Requested JSON parse failed.';
			} else if (exception === 'timeout') {
				msg = 'Time out error.';
			} else if (exception === 'abort') {
				msg = 'Ajax request aborted.';
			} else {
				msg = 'Uncaught Error.\n' + jqXHR.responseText;
			}
			window.alert(msg);
		},
		success: function(result) {
			jsonResult = eval(result);
			tableString = "";

			//Get scrollbar and adjust width of it:
			var adjustedSize = $("#th7").outerWidth() - adjustToScrollBar();

			//Empty table content
			$("#tableBody").empty();
			$("#groupSelect").empty();
			$("#episodeSelect").empty();
			$("#resolutionSelect").empty();

			//Loop through all items and fill database
			for(var key = 0; key < jsonResult.length; key++){
				switch(jsonResult[key]['rating']){
					case 'Trusted':
						torrentType = 'TrustedTorrent';
						break;
					case 'Remake':
						torrentType = "RemakeTorrent";
						break;
					case 'A+ ':
						torrentType = "AplusTorrent";
						break;
					default:
						torrentType = "defaultTorrent";
						break;
				}

				tableString += "<tr onclick='selectRow(this)' id='"+jsonResult[key]['id']+"' class='"+torrentType+"'>" +
								"<td class='tableInput' style='width:"+$("#th0").outerWidth()+"px !important;'><input type='checkbox' name='select"+jsonResult[key]+"'><label></label></td>" +
								"<td id='group' name='group' class='tableGroup' style='width:"+$("#th1").outerWidth()+"px !important;'>"+jsonResult[key]['group']+"</td>" +
								"<td id='name' name='name' class='tableName' style='width:"+$("#th2").outerWidth()+"px !important;'>"+jsonResult[key]['name']+"</td>" +
								"<td id='episode' name='episode' class='tableEpisode' style='width:"+$("#th3").outerWidth()+"px !important;'>"+jsonResult[key]['episode']+"</td>" +
								"<td id='resolution' name='resolution' class='tableResolution' style='width:"+$("#th4").outerWidth()+"px !important;'>"+jsonResult[key]['resolution']+"</td>"+
								"<td id='seeders' name='seeders' class='tableSeeders' style='width:"+$("#th5").outerWidth()+"px !important;'>"+jsonResult[key]['seeders']+"</td>"+
								"<td id='leechers' name='leechers' class='tableLeechers' style='width:"+$("#th6").outerWidth()+"px !important;'>"+jsonResult[key]['leechers']+"</td>"+
								"<td id='size' name='size' class='tableSize' style='width:"+adjustedSize+"px !important;'>"+jsonResult[key]['size']+"</td>"+
								"</tr>";

				//Save all different groups
				groups.push(jsonResult[key]['group']);

				//Save all different episodes
				episodes.push(jsonResult[key]['episode']);

				//Remove unnecessary information
				var resolutionResult = jsonResult[key]['resolution'].match(/[0-9]{1,4}[p]/gi, "")
				//Save all different resolutions
				if(resolutionResult != null){
					resolutions.push(resolutionResult.toString());
				}

			}
			console.log(tableString);
			$("#tableBody").append(tableString);

			//Remove double items
			$.each(groups, function(i, el){
				if($.inArray(el, groupList) === -1 && el.length > 1) groupList.push(el);
			});

			//Remove double items
			$.each(episodes, function(i, el){
				if($.inArray(el, episodeList) === -1 && el.length > 1) episodeList.push(el);
			});

			//Remove double items
			$.each(resolutions, function(i, el){
				if($.inArray(el, resolutionList) === -1 && el.length > 1) resolutionList.push(el);
			});

			//Fill group filter accordion
			for(var key = 0; key < groupList.length; key++){
				$("#groupSelect").append("<div onclick='selectRow(this)' ><input type='checkbox' value='"+groupList[key]+"' id='groups' name='select'><label>"+groupList[key]+"</label></div><br/><br/>");
			}

			//Fill episode filter accordion
			for(var key = 0; key < episodeList.length; key++){
				$("#episodeSelect").append("<div onclick='selectRow(this)' ><input type='checkbox' value='"+episodeList[key]+"' id='episodes' name='select'><label>"+episodeList[key]+"</label></div><br/><br/>");
			}

			//Fill episode filter accordion
			for(var key = 0; key < resolutionList.length; key++){
				$("#resolutionSelect").append("<div onclick='selectRow(this)' ><input type='checkbox' value='"+resolutionList[key]+"' id='resolutions' name='select'><label>"+resolutionList[key]+"</label></div><br/><br/>");
			}


			//initialize list.js
			initializeTable();
		}
	});
}

//Initialization of the list.js table.
function initializeTable(){
	//Check if table is already initialized
	if(tableList != null){
		//Reindex the table when the table was already created
		tableList.reIndex();
	} else {
		//Set the headers of the table
		options = { valueNames: ['tableGroup', 'tableName', 'tableEpisode', 'tableResolution', 'tableSeeders', 'tableLeechers', 'tableSize'] };
		//Initialize table
		tableList = new List('tableDiv', options);
	}

}

//Login function
//Uses the sweetAlert2 plugin
//This function is called upon opening page
function login(){
	//Show pop-up for logging in
	swal({
			html: '<nav class="navbar navbar-inverse" style=";box-shadow:0px 2px 11px #363636;"><h1>Login</h1></nav><input id="user-field" placeholder="username"><input type="password" id="pass-field" placeholder="password">',
			showCancelButton: false,
			closeOnConfirm: false,
			allowOutsideClick: false,
			confirmButtonText: "Submit",
			confirmButtonColor: "#363636",
			confirmButtonClass: "submitButton",
			animation: "slide-from-top",
		},
		function() {
			//Start this code when submit button is clicked
			//Check if any field is not empty
			if (
				$('#user-field').val() === "" ||
				$('#pass-field').val() === "" ||
				$('#user-field').val() === false ||
				$('#pass-field').val() === false
			) {
				//Show new pop-up when user didn't put in credentials
				swal({
						title: "Please fill in the input fields",
						type: "error"
					},
					function() {
						//Reload page to let the user login again
						location.reload();
					});
			} else {

				//Call login.php file for logging in
				setTimeout(function () {
					$.ajax({
						type: "post",
						url: '../Functions/Login.php',
						data: {
							'login': $('#user-field').val(),
							'pass': $('#pass-field').val()
						},
						success: function (result) {
							//Check if user logged in successfully
							if (result == 1) {
								//When user has logged in successfully
								//Create new pop-up signaling the user that it was succesfully logged in
								swal({
									title: "succesfully logged in!",
									html: "<h5>you\'ll be redirected to the page in a moment.</h5><br/>",
									type: "success",
									timer: 2000,
									showConfirmButton: false
								});
							} else {
								//When user credentials were incorrect
								//Create new pop-up signaling the user that it couldn't log in.
								swal({
										title: "failed to login!",
										text: "Please try again",
										type: "error"
									},
									function () {
										//Reload the page
										location.reload();
									});
							}

						}
					});
				}, 2000);

			}
		})
}

//SelectRow function takes care of selecting torrents as well as filters
function selectRow(row){
	//First get the input that was clicked and change it's state
	var firstInput = row.getElementsByTagName('input')[0];
	firstInput.checked = !firstInput.checked;

	//check if the checkbox is checked or not and check what filter it is
	if(firstInput.checked){

		//Switch checks what filter was pushed and put the value in the corresponding array
		switch(firstInput.id){
			case 'groups':
				groupFilters.push(firstInput.value);
				break;
			case 'episodes':
				episodeFilters.push(firstInput.value);
				break;
			case 'resolutions':
				resolutionFilters.push(firstInput.value);
				break;
		}
	} else {

		//Switch removes the corresponding value when the input was unchecked
		switch(firstInput.id){
			case 'groups':
				if(groupFilters.indexOf(firstInput.value) != -1) {
					groupFilters.splice(groupFilters.indexOf(firstInput.value), 1);
				}
				break;
			case 'episodes':
				if(episodeFilters.indexOf(firstInput.value) != -1) {
					episodeFilters.splice(episodeFilters.indexOf(firstInput.value), 1);
				}
				break;
			case 'resolutions':
				if(resolutionFilters.indexOf(firstInput.value) != -1) {
					resolutionFilters.splice(resolutionFilters.indexOf(firstInput.value), 1);
				}
				break;
		}

	}

	//Update the filters for the table
	setFilter();
}

//Set the filters for the torrents in the table
function setFilter(){
	//Check if there are any filters
	if(groupFilters.length < 1 && episodeFilters.length < 1 && resolutionFilters.length < 1){
		//Reset all filters of the table
		tableList.filter();
		return false;
	}

	//Loop through all filter options
	tableList.filter(function(item){
		//Check what function is needed for this filter
		if(
			groupFiltering(item) &&
			episodeFiltering(item) &&
			resolutionFiltering(item)
		){
			//Return true to add filter
			return true;
		}

		//Return false to remove filter
		return false;
	});
}

//Filter function for all the groups
function groupFiltering(item){

	//Check if group filters actually has filters
	if(groupFilters.length > 0){

		//Loop through the group filters
		for(var j = 0; j < groupFilters.length; j++) {

			//If the torrent contains the group filter
			if(item.values().tableGroup.indexOf(groupFilters[j]) > -1){
				//Return true when torrent fits requirements
				return true;
			}
		}

		//Return false when torrent doesn't fit the requirements
		return false;
	}

	//Return false when there aren't any filters
	return true;
}

//Filter function for all the episodes
function episodeFiltering(item){

	//Check if episode filters actually has filters
	if(episodeFilters.length > 0) {

		//Loop through the episode filters
		for (var j = 0; j < episodeFilters.length; j++) {

			//If the torrent contains the episode filter
			if (item.values().tableEpisode.indexOf(episodeFilters[j]) > -1) {
				//Return true when torrent fits requirements
				return true;
			}
		}

		//Return false when torrent doesn't fit the requirements
		return false;
	}

	//Return false when there aren't any filters
	return true;
}

//Filter function for all the resolution
function resolutionFiltering(item){

	//Check if resolution filters actually has filters
	if(resolutionFilters.length > 0) {

		//Loop through the resolution filters
		for (var j = 0; j < resolutionFilters.length; j++) {

			//If the torrent contains the resolution filter
			if (item.values().tableResolution.indexOf(resolutionFilters[j]) > -1) {
				//Return true when torrent fits requirements
				return true;
			}
		}

		//Return false when torrent doesn't fit the requirements
		return false;
	}

	//Return false when torrent doesn't fit the requirements
	return true;
}

//Get the width of the scrollbar + the margin to the right of the scrollbar
function adjustToScrollBar() {
	var $outer = $('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body'),
		widthWithScroll = $('<div>').css({width: '100%'}).appendTo($outer).outerWidth();
	$outer.remove();
	return 102 - widthWithScroll;
};

//Login splashscreen
//window.onload = login;