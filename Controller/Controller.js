function crawl(){
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
			console.log(result);
			var jsonResult = eval(result);

			//Set arrays
			var groups = [];
			var groupList = [];
			var episodes = [];
			var episodeList = [];
			var resolutions = [];
			var resolutionList = [];

			//Empty table content
			$("#tableBody").empty();
			$("#groupSelect").empty();
			$("#episodeSelect").empty();
			$("#resolutionSelect").empty();

			//Loop through all items and fill database
			for(var key = 0; key < jsonResult.length; key++){
				$("#tableBody").append("<tr onclick='selectRow(this)' id='"+jsonResult[key]['id']+"'>");
				$("#"+jsonResult[key]['id']+"").append("<td><input type='checkbox' name='select"+jsonResult[key]+"'><label></label></td>");
				$("#"+jsonResult[key]['id']+"").append("<td id='group' name='group' class='tableGroup'>"+jsonResult[key]['group']+"</td>");
				$("#"+jsonResult[key]['id']+"").append("<td id='name' name='name' class='tableName'>"+jsonResult[key]['name']+"</td>");
				$("#"+jsonResult[key]['id']+"").append("<td id='episode' name='episode' class='tableEpisode'>"+jsonResult[key]['episode']+"</td>");
				$("#"+jsonResult[key]['id']+"").append("<td id='resolution' name='resolution' class='tableResolution'>"+jsonResult[key]['resolution']+"</td>");
				$("#"+jsonResult[key]['id']+"").append("<td id='seeders' name='seeders' class='tableSeeders'>"+jsonResult[key]['seeders']+"</td>");
				$("#"+jsonResult[key]['id']+"").append("<td id='leechers' name='leechers' class='tableLeechers'>"+jsonResult[key]['leechers']+"</td>");
				$("#"+jsonResult[key]['id']+"").append("<td id='size' name='size' class='tableSize'>"+jsonResult[key]['size']+"</td>");
				$("#"+jsonResult[key]['id']+"").append("</tr>");

				//Set width of columns correct to corresponding header cells
				$("#"+jsonResult[key]['id']+" #"+jsonResult[key]['id']).width($("#th0").width());
				$("#"+jsonResult[key]['id']+" #group").width($("#th1").width());
				$("#"+jsonResult[key]['id']+" #name").width($("#th2").width());
				$("#"+jsonResult[key]['id']+" #episode").width($("#th3").width());
				$("#"+jsonResult[key]['id']+" #resolution").width($("#th4").width());
				$("#"+jsonResult[key]['id']+" #seeders").width($("#th5").width());
				$("#"+jsonResult[key]['id']+" #leechers").width($("#th6").width());
				$("#"+jsonResult[key]['id']+" #size").width($("#th7").width() - 15);

				//Save all different groups
				groups.push(jsonResult[key]['group']);

				//Save all different episodes
				episodes.push(jsonResult[key]['episode']);

				//Save all different resolutions
				resolutions.push(jsonResult[key]['resolution'].replace(/\s/g, ''));
			}

			//Remove double items
			$.each(groups, function(i, el){
				if($.inArray(el, groupList) === -1 && el.length > 1) groupList.push(el);
			});

			$.each(episodes, function(i, el){
				if($.inArray(el, episodeList) === -1 && el.length > 1) episodeList.push(el);
			});

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