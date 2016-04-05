<?php
	class Database {
		/*
		* Variables
		*/
		
		/*
		*	Create new Database
		*/
		public function InitializeDatabase($file){
			if (!file_exists($file)) {
				fopen($file, "a") or die("can't open file");	
				$GLOBALS = array("db" => new SQLITE3($file));
				$this->createTable($file);				
			} else {
				$GLOBALS = array("db" => new SQLITE3($file));
			}			
		}
		
		
		/*
		*	Open database
		*/
		private function openDatabaseStream($file){
			try {
				$GLOBALS["db"]->open($file);
			} catch(Exception $e){
				
			}
		}
		
		
		/*
		*	Create table
		*/
		public function createTable($file){			
			//Create table
			$GLOBALS["db"]->exec("CREATE TABLE templates (
				groupId INT(10) PRIMARY KEY, 
				templateRegex VARCHAR(300),
				templateBatchRegex VARCHAR(300),
				templateGroups VARCHAR(300)
			)");
		}
		
		
		/*
		*	Send query and return object
		*/
		public function databaseQuery($file, $selectQuery){
			//Open database connection
			$this->openDatabaseStream($file);
			
			//Get results from query
			$result = $GLOBALS["db"]->query($selectQuery);

			//return the array from the result
			return($result);
		}
		
		
		/*
		*	Add new row
		*/
		public function addRow($file, $addQuery){
			//Open database connection
			$this->openDatabaseStream($file);

			//Delete row
			$GLOBALS["db"]->exec($addQuery);	
		}
		
		
		/*
		*	Remove row
		*/
		public function removeRow($file, $tablename, $deletefrom){
			//Open database connection
			$this->openDatabaseStream($file);
			
			//Delete row
			$GLOBALS["db"]->exec("DELETE FROM ".$tablename." WHERE ".$deletefrom);
		}
		
		
		/*
		*	update row
		*/
		public function updateRow($file, $updateQuery){
			//Open database connection
			$this->openDatabaseStream($file);
			
			//Delete row
			$GLOBALS["db"]->exec($updateQuery);
		}
	}
?>