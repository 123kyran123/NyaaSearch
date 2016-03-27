<?php
	include_once("../SHD/simple_html_dom.php");

	//getHTML($_POST["search"]);
	getHTML("saenai");
	
	function createLink($search){
		return "http://www.nyaa.se/?page=search&cats=1_37&term=".$search."&offset=";		
	}
	
	function getHTML($search) {
		//Setup Arrays
		$pagesArray = array();
		$page = 1;
		
		//Create link
		$searchLink = createLink($search);
		while($page < 100 || $page != 0){
			
			//Get HTML from link + page
			$content = file_get_html($searchLink."".$page);
			
			//First cut content and such until only table is left
			$table = getTable($content);
			//$pagesArray[] = $content;
			
			//Check if page is empty
			if(count($table) < 4){
				break;
			}

			//next page
			$page++;
			
			//echo content
			//print_r($table);
		}
		
	}
	
	function getTable($content){
		//Initialize variables
		$tableArray = Array();
		
		//Loop through rows
		$rows = $content->find("tr");
		
		foreach($rows as $row){
			$tableRow = Array();
			
			//Check if content is necessary
			if(
				strpos($row->innertext, "Date") === false &&
				strpos($row->innertext, "Category") === false
			){
				//Get all sub items
				$tdList = $row->find("td");
				
				foreach($tdList as $td){
					
					//Check if table cell contains the torrent info
					if(!is_numeric(substr($td->innertext, 0, 1)) && strpos($td->innertext, "<img") === false && strpos($td->innertext, "No torrents found") === false){
						
						//Get information from the name
						$tableRow[] = getTorrentInfo($td);
						
					} else if(strpos($td->innertext, "<img") === false){
						
						$tableRow[] = $td->innertext;
						
					}				
				}
				
				$tableArray[] = $tableRow;
			}
			
			unset($tableRow);
			

		}
		return $tableArray;
		
	}
	
	function getTorrentInfo($td){
		$groupInfo = Array();
		
		//Get the group of the show
		if(strpos(substr($td->innertext, 0, 1), "[") !== true){	
		
			//Check if name isn't too long for a group
			$group = $td->innertext;
			$group = explode("]", strip_tags($group))[0];
			
			if(strlen($group) < 30){
				
				if(stripos($group, "batch") === false){
					//Remove the [ tag from the group name
					$group = explode("[", $group)[1];	
				
					//Fill Array with groups
					$groupInfo[] = $group;
				}
				
				//Get Name of the show
				$name = $td->innertext;
				$name = explode("]", strip_tags($name))[1];
				echo $name."<br/>";
				
			}
		}
		
		
		//echo explode("]", explode("[", $td->innertext)[1])[1]." ".$groupInfo[0]."<br/>";
	}
?>