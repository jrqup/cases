<?php
header('Access-Control-Allow-Origin:*');
header('Content-type:text/json');
require_once("../../init.php");
function register(){
	global $conn;
	@$uname=$_REQUEST["uname"];
	@$upwd=$_REQUEST["upwd"];
	$sql="insert into xz_user (uid,uname,upwd) values (null,'$uname','$upwd')";
	$result=mysqli_query($conn,$sql);
	if(!$result){
      echo('{"code":500, "msg":"db execute err"}');
    }else {
      $uid = mysqli_insert_id($conn);
      echo('{"code":200, "msg":"register succ", "uid":'.$uid.'}');
    }
}
function checkName(){
	global $conn;
	@$uname=$_REQUEST["uname"];
	if($uname){
		$sql="select * from xz_user where uname='$uname'";
		$result=mysqli_query($conn,$sql);
		$users=mysqli_fetch_all($result,1);
		if(count($users)!=0)
			return false;
		else
			return true;
	}
}
function login(){
	global $conn;
	@$uname=$_REQUEST["uname"];
	@$upwd=$_REQUEST["upwd"];
	if($uname&&$upwd){
		$sql="select * from xz_user where uname='$uname' and binary upwd='$upwd'";
		$result=mysqli_query($conn,$sql);
		$user=mysqli_fetch_all($result,1);
		if(count($user)!=0){
			session_start();
			$_SESSION["uid"]=$user[0]["uid"];
			echo '{"code":1,"msg":"登录成功"}';
        }else{
            echo '{"code":-1,"msg":"登录失败"}';
        }
	}
}

function logout(){
	session_start();
	session_unset();
	session_destroy();
	echo true;
}

function isLogin(){
	global $conn;
	session_start();
	@$uid=$_SESSION["uid"];
	if($uid){
		$sql=
			"select uname from xz_user where uid=$uid";
		$result=mysqli_query($conn,$sql);
		$user=mysqli_fetch_all($result,1);
		return ["ok"=>1,"uname"=>$user[0]["uname"]];
	}else
		return ["ok"=>0];
}