<?php
require_once("../../init.php");
function get_index_products(){
	global $conn;
	$output=[];
	$sql="select * from xz_index_ag where seq_recommended=1";
	$result=mysqli_query($conn,$sql);
	$products=mysqli_fetch_all($result,1);
	$output["recommendedItemOne"]=$products;

	$sql="select * from xz_index_ag where seq_recommended=2";
	$result=mysqli_query($conn,$sql);
	$products=mysqli_fetch_all($result,1);
	$output["recommendedItemTwo"]=$products;

	$sql="select * from xz_index_ag where seq_recommended=3";
	$result=mysqli_query($conn,$sql);
	$products=mysqli_fetch_all($result,1);
	$output["recommendedItemThrow"]=$products;

	$sql="select * from xz_index_ag where seq_recommended=4";
	$result=mysqli_query($conn,$sql);
	$products=mysqli_fetch_all($result,1);
	$output["recommendedItemFour"]=$products;

	echo json_encode($output);
}
//get_index_products();
function getProductsByKw(){
	global $conn;
	$output=[
		"count"=>0,//总个数
		"pageSize"=>15,//每页15个
		"pageCount"=>0,//总页数
		"pageNo"=>0,//现在第几页
		"data"=>[]//商品列表
	];
	@$pno=(int)$_REQUEST["pno"];
	if($pno) $output["pageNo"]=$pno;
	@$kw=$_REQUEST["kw"];
	$sql="select lid,price,lname,cpu,memory,category,(select md from xz_laptop_pic where laptop_id=lid limit 1) as md from xz_laptop ";
	if($kw){
		$kws=explode(" ",$kw);
		for($i=0;$i<count($kws);$i++){
			$kws[$i]=" title like '%".$kws[$i]."%' ";
		}
		$sql.=" where ".implode(" and ",$kws);
		               //js: $kws.join(" and ")
	}
	$result=mysqli_query($conn,$sql);
	$products=mysqli_fetch_all($result,1);
	$output["count"]=count($products);
	$output["pageCount"]=
		ceil($output["count"]/$output["pageSize"]);
	$sql.=" limit ".
				(($output["pageNo"]-1)*$output["pageSize"]).
		    ",".
				$output["pageSize"];
	$result=mysqli_query($conn,$sql);
	$output["data"]=mysqli_fetch_all($result,1);
	echo json_encode($output);
}
//getProductsByKw();
function getProductById(){
	global $conn;
	@$lid=$_REQUEST["lid"];
	$output=[
		//"product":[
			//lid, 
			//title, 
			//family_id, 
			//price, 
			//promise, 
			//md
		//],
		//"family"=>[{lid, spec},{lid, spec},...],
		//"imgs"=>[sm1,sm2,sm3,...]
	];
	if($lid){
		$sql="select lid,fid,title,subtitle,price,promise,(select md from xz_laptop_pic where laptop_id=lid limit 1) as md from xz_laptop where lid=$lid";
		$result=mysqli_query($conn,$sql);
		$output["product"]=
			mysqli_fetch_all($result,1)[0];
		$fid=$output["product"]["fid"];
		$sql="select lid, spec from xz_laptop where fid=$fid";
		$result=mysqli_query($conn,$sql);
		$output["family"]=mysqli_fetch_all($result,1);
		$sql="select sm,md,lg from xz_laptop_pic where laptop_id=$lid";
		$result=mysqli_query($conn,$sql);
		$output["imgs"]=mysqli_fetch_all($result,1);
		echo json_encode($output);
	}
}
//getProductById();
function getCarousel(){
	global $conn;
	$sql="select * from xz_index_carousel";
	$result=mysqli_query($conn,$sql);
	echo json_encode(mysqli_fetch_all($result,1));
}
//getCarousel();
function searchHelper(){
	global $conn;
	@$kw=$_REQUEST["term"];//?term=mac 256g
	$sql="select lid,lname,sold_count from xz_laptop ";
	if($kw){
		$kws=explode(" ",$kw);
		for($i=0;$i<count($kws);$i++){
			$kws[$i]=" title like '%".$kws[$i]."%' ";
		}
		$sql.=" where ".implode(" and ",$kws);
	}
	$sql.=" order by sold_count DESC limit 10";
	$result=mysqli_query($conn,$sql);
	echo json_encode(mysqli_fetch_all($result,1));
}
