<?php 
    $server = "localhost";
    $username = "root";
    $password = "";
    $database = "scores";
    
    if(!empty($_GET["name"])){
        $name = htmlspecialchars($_GET["name"]);
        $score = htmlspecialchars($_GET["score"]);
        $conn = new mysqli($server, $username, $password, $database);
        $date = getdate()[0];
        $sql = "INSERT INTO scores (name, score) VALUES ('$name', '$score')";
        if($conn->query($sql) === TRUE){
            echo "DONE";
        } else {
            echo $conn->error;
        }
        
    } else {
        $array = array();
        $conn = new mysqli($server, $username, $password, $database);
        $sql = "SELECT name, score FROM scores ORDER BY score DESC";
        $result = $conn->query($sql);
        while($row =mysqli_fetch_assoc($result)){
            $array[] = $row;
    }
        
        echo json_encode($array);
    }
$conn->close();
    
?>