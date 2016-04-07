<?php

    include_once("Database.php");
    include_once("DatabaseHelper.php");

    if(isset($_POST['login'])) {
        $Database = new Database();
        $userDB = $_SERVER['DOCUMENT_ROOT'] . "\\Nyaa_Search\\loginCredentials.sqlite";
        //Initialize the video database
        $Database->InitializeDatabase($userDB);

        //Check if user exists
        $result = getLoginCredentials($Database, $userDB, $_POST['login'], $_POST['pass']);

        if($result->fetchArray()){
            echo true;
        } else {
            echo false;
        }
    }


?>