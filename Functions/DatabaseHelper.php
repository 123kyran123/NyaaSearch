<?php
	//Get all subgroups
	function getAllGroups($Database, $videoDB){

		$resultQuery = $Database->databaseQuery($videoDB, "SELECT * FROM templates");
		//reset array
		unset($table);
		$table = array();

		//Check if row is found:
		if(count($resultQuery) !== 0){
			while($row = $resultQuery->fetchArray()){
				$template["id"] = $row["groupId"];
				$template["groups"] = $row["templateGroups"];
				$template["regex"] = html_entity_decode($row["templateRegex"]);
				$template["batchRegex"] = html_entity_decode($row["templateBatchRegex"]);
				$table[] = $template;
			}
			return $table;
		} else {
			return false;
		}
	}

	//Include group to database
	function addGroup($Database, $videoDB, $name, $group, $episode, $resolution){
		//Check if group already exists
		$resultQuery = getAllGroups($Database, $videoDB);
		for($i = 0; $i < count($resultQuery); $i++){
			if($resultQuery[$i][1] == $name){
				$resultQuery = false;
			}
		}

		if($resolution != false){
			$Database->addQuery($videoDB, "INSERT INTO templates ('templateName', 'templateGroups', 'templateEpisode', 'templateResolution') VALUES ($name, $group, $episode, $resolution)");
		} else {
			return false;
		}
	}

	function getLoginCredentials($Database, $userDB, $username, $password){
		if(
			$username != "" || $username != false || !preg_match('/\s/',$username) ||
			$password != "" || $password != false || !preg_match('/\s/',$password)
		) {
			$query = "SELECT * FROM users WHERE userName = '".$username."' AND userPassword = '".$password."'";
			return $Database->databaseQuery($userDB, $query);
		}
	}

?>