<?php

/* esempio stringa connesisone PDO.....'sqlsrv:server=SRV2012DC\MSSQLSERVER2012;Database=TestPHP'*/

class Database{
  
    // specify your own database credentials
    private $host = "SRV2012DC\MSSQLSERVER2012";
    private $db_name = "GestionaleTest";
    private $username = "sa";
    private $password = "V1ttor1aSQL";
    public $conn;
  
    // get the database connection
    public function getConnection(){
  
        $this->conn = null;
  
        try{
            $this->conn = new PDO("sqlsrv:server=" . $this->host . ";Database=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
            //$this->conn->exec();
        }catch(PDOException $exception){
            echo "Connection error: " . $exception->getMessage();
        }
  
        return $this->conn;
    }
}
?>