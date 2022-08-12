<?php 



$arr_user=array();
$arr_log=array();
$arr_post=array();

$arr_user["id"]="potato";
$arr_post["user"]=$arr_user;
$arr_log[0]["id"]="1"
$arr_log[0]["log_val"] = "43";
$arr_log[1]["id"] = "2";
$arr_log[1]["log_val"] = "44";

$arr_post["log"] = $arr_log;
$post_data = json_encode($arr_post);

//CURL함수 사용
$ch=curl_init();
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, "http://220.69.240.130:3000");
//POST방식
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POST, true);
//POST방식으로 넘길 데이터(JSON데이터)
curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
curl_setopt($ch, CURLOPT_TIMEOUT, 3);

$response = curl_exec($ch);

if(curl_error($ch)){
    $curl_data = null;
} else {
    $curl_data = $response;
}

curl_close($ch);

//받은 JSON데이터를 배열로 만듬
$json_data = json_decode($curl_data,true);
//배열 제어
if($json_data["result"] == "200"){
	$cnt = 0;
	foreach($json_data["msg"] as $msg_data){
		foreach($msg_data as $msgval_data){
			//msg_val값만 출력합니다.
			echo $msgval_data[$cnt]["msg_val"];
			$cnt++;
		}
	}
}

exit;


/*$json_data = json_decode($curl_data,true);

echo $_POST[$post_data];
*/



?>
