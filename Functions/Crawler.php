<?php
	include_once("Database.php");
	include_once("DatabaseHelper.php");

json_encode(array_values(getHTML('saenai')));

	if(isset($_POST['crawlNyaa'])){
		echo json_encode(array_values(getHTML($_POST["crawlNyaa"])));
	}
	
	function createLink($search, $page){
		return "http://www.nyaa.se/?page=rss&cats=1_37&filter=0&term=".$search."&offset=".$page;
	}
	
	function getHTML($search){

		//Initialize database
		$Database = new Database();
		$videoDB = $_SERVER['DOCUMENT_ROOT']."\\Nyaa_Search\\groupTemplates.sqlite";

		//Initialize the video database
		$Database->InitializeDatabase($videoDB);

		$torrents = array();
		$page = 1;

		//get Group templates
		$groupQuery = getAllGroups($Database, $videoDB);

		//Loop through pages
		while($page != 0){
			//Create link
			$searchLink = createLink($search, $page);

			//Get RSS feed
			$xmlDoc = new DOMDocument();
			$xmlDoc->load($searchLink);
			$items = $xmlDoc->getElementsByTagName('item');
			$count = 0;

			//Loop through torrents
			foreach($items as $i => $item){
				$count++;

				//Get torrent information
				$torrentInfo = $item->getElementsByTagName('description')->item(0)->childNodes->item(0)->nodeValue;
				$torrentSeeders = explode("," ,$torrentInfo)[0];
				$torrentLeechers = explode("," ,$torrentInfo)[1];
				$torrentDownloads = explode("," ,$torrentInfo)[2];
				$torrentDownloads = explode("-", $torrentDownloads)[0];
				$torrentSize = explode(" - " ,$torrentInfo)[1];
				if(preg_match('/\-[\s_](?<rating>[Trusted|Remake|Aplus].+)?$/', $torrentInfo, $matches) != 0){
					$torrentRating = explode("- ", $matches[0])[1];
				} else {
					$torrentRating = "";
				}

				$torrentDate  = date("YmdHis", strtotime($item->getElementsByTagName('pubDate')->item(0)->childNodes->item(0)->nodeValue));
				$torrentLink  = $item->getElementsByTagName('link')->item(0)->childNodes->item(0)->nodeValue;
				$torrentId = getNyaaId($torrentLink);


				for($i = 0; $i < count($groupQuery); $i++){
					//check if $items has a group template
					if(stripos($item->getElementsByTagName('title')->item(0)->childNodes->item(0)->nodeValue, $groupQuery[$i]['groups'])) {

						//Check if batch
						if (preg_match('/\.?(?<batch>(?:BD|TV|Batch|Vol.*?))/', $item->getElementsByTagName('title')->item(0)->childNodes->item(0)->nodeValue)) {
							if(preg_match($groupQuery[$i]['batchRegex'], $item->getElementsByTagName('title')->item(0)->childNodes->item(0)->nodeValue, $matches) != 0){

								if(stripos($matches['show'], " Vol") !== false){
									$volume = "Volume ".explode("Vol", $matches['show'])[1];
									if(stripos($volume, ".") !== false){
										$volume = "Volume ".explode(".", $volume)[1];
									}

									if(stripos($matches['show'], "-") !== false){
										$name = explode(" -" ,$matches['show'])[0];
									} else {
										$name = explode(" V" ,$matches['show'])[0];
									}

								} else {
									$volume = "Batch";
									$name = $matches['show'];
								}

								if(array_key_exists(5, $matches)){
									$resolution = $matches[4]." ".$matches[5];
								} else {
									$resolution = $matches[4];
								}

								$torrents[] = array(
									"id" => $torrentId,
									"name" => $name,
									"group" => $matches['group'],
									"episode" => $volume,
									"resolution" => $resolution,
									"seeders" => $torrentSeeders,
									"leechers" => $torrentLeechers,
									"downloads" => $torrentDownloads,
									"size" => $torrentSize,
									"link" => $torrentLink,
									"date" => $torrentDate,
									"rating" => $torrentRating
								);
							}

						} else {
							if(preg_match($groupQuery[$i]['regex'], $item->getElementsByTagName('title')->item(0)->childNodes->item(0)->nodeValue, $matches) != 0){
								$torrents[] = array(
									"id" => $torrentId,
									"name" => $matches['show'],
									"group" => $matches['group'],
									"episode" => $matches['episode'],
									"resolution" => $matches[4]." ".$matches[5],
									"seeders" => $torrentSeeders,
									"leechers" => $torrentLeechers,
									"downloads" => $torrentDownloads,
									"size" => $torrentSize,
									"link" => $torrentLink,
									"date" => $torrentDate,
									"rating" => $torrentRating
								);
							}
						}

					}
				}
		}













/*
			//Get information out of torrent name
			$torrentTitle = getTorrentInfo($item->getElementsByTagName('title')->item(0)->childNodes->item(0)->nodeValue, $torrentInformation);
			$torrentName = $torrentTitle[1];
			$torrentGroup = $torrentTitle[0];
			$torrentEpisode = $torrentTitle[2];
			$torrentResolution = $torrentTitle[3];

			//Get other torrent Information
			$torrentInfo = $item->getElementsByTagName('description')->item(0)->childNodes->item(0)->nodeValue;
			$torrentSeeders = explode("," ,$torrentInfo)[0];
			$torrentLeechers = explode("," ,$torrentInfo)[1];
			$torrentDownloads = explode("," ,$torrentInfo)[2];
			$torrentSize = explode(" - " ,$torrentInfo)[1];

			if(array_key_exists(2, explode(" - " ,$torrentInfo))) {
				$torrentType = explode(" - " ,$torrentInfo)[2];
			} else {
				$torrentType = "None";
			}

			$torrentDate  = date("YmdHis", strtotime($item->getElementsByTagName('pubDate')->item(0)->childNodes->item(0)->nodeValue));
			$torrentLink  = $item->getElementsByTagName('link')->item(0)->childNodes->item(0)->nodeValue;
			$torrentId = $torrentInformation::getNyaaId($torrentLink);

			$torrents[] = array(
							"id" => $torrentId,
							"name" => $torrentName,
							"group" => $torrentGroup,
							"episode" => $torrentEpisode,
							"resolution" => $torrentResolution,
							"type" => $torrentType,
							"seeders" => $torrentSeeders,
							"leechers" => $torrentLeechers,
							"downloads" => $torrentDownloads,
							"size" => $torrentSize,
							"link" => $torrentLink,
							"date" => $torrentDate
			);*/

			if($count < 10){
				$page = 0;
			} else {
				$page++;
			}
		}
		return array_values($torrents);
	}

	function getNyaaId($url)
	{
		$query = array();
		$url = parse_url($url);
		parse_str($url['query'], $query);
		return $query['tid'];
	}

	/*//Get torrentInformation from name
	function getTorrentInfo($td, $torrentInformation){
		$strippedInfo = $torrentInformation::stripInfo($td);
		$torrentGroup = $torrentInformation::getGroup($strippedInfo);
		$torrentEpisode = $torrentInformation::getEpisode($td);
		$torrentName = $torrentInformation::getName($td, $torrentGroup);
		$torrentResolution = $torrentInformation::getResolution($td);

		if($torrentGroup != false){
			$torrentInfo = Array();
			$torrentInfo[] = $torrentGroup;
			$torrentInfo[] = $torrentName;
			$torrentInfo[] = $torrentEpisode;
			$torrentInfo[] = $torrentResolution;

			return array_values($torrentInfo);
		}

		return false;
	}*/
?>