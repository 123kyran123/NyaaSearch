function crawl(){	
	jQuery.ajax({
		type: "post",
		url: '../Functions/Crawler.php',
		data: { search: document.getElementById("link").value },
		dataType: 'html',
		success: function(result) {
			window.alert(result);
			//document.getElementById("link").value = result;
		},
	});
}

