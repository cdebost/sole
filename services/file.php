<?php


error_reporting(0);

$contents = @$_POST["data"];
$type = @$_POST["type"];
$name = @$_POST["name"];
$append = @$_POST["append"];

if (!$append || $append == -1 || (strlen($append) < 5)) {
    $append = 0;
}

#echo "Access-Control-Allow-Origin: *\n";
#echo "Content-type:  text/script\n\n";
header( 'Access-Control-Allow-Origin: *');
#  header( 'Content-type: application/json' );

if (substr($name,0,1) == '~') {
    $name = "../private/chilitv/users/".substr($name,1);
}


function save_to_log($name, $type) {

	$file = @fopen("./log.txt","a");

	$host = $_SERVER["HTTP_HOST"];
	$server = $_SERVER["HTTP_REFERER"];
	$t = $_SERVER["REQUEST_TIME"];


	if (flock($file, LOCK_EX)) {
		fwrite($file,$t . ":" . $host . ":" . $server . " " . $type . " " . $name . "\n");
		flock($file, LOCK_UN);
		$er = "SUCCESS - got and released lock!";
	} else {
		$er = "Could not get lock!\n";
	}
	fclose($file);




}

#save_to_log($name, $type, $total);

function outputResponse($response) {
    global $callback,$req_id;

    if(isset($callback)) {
        echo $callback . "('";
    }

    echo $response;

    if(isset($callback)) {
        if(isset($req_id)) {
            echo "','" . json_encode($req_id);
        }
        echo "');";
    }
}


if (($type == "save") || ($type == "append")) {

        $fdir = substr($name,0, strrpos($name,'/'));
        $er = 0;
        if (!(is_dir($fdir))) {
            if (!mkdir($fdir, 0755, true)) {
                $er = "CANT CREATE DIRECTORY " . $name . "=" . $fdir;

            }
        }
        if (!$er) {
            $mode = ($type == "append") ? "a" : "w";
			if (!file_exists($name)) {
				$mode = "w";
			}

			$file = @fopen($name,$mode);

			if (flock($file, LOCK_EX)) {
				fwrite($file,$contents);
				flock($file, LOCK_UN);
			    $er = "SUCCESS - got and released lock!";
			} else {
				$er = "Could not get lock!\n";
			}
			fclose($file);
        }

        $mode = "a";
        if (!file_exists($append)) {
            $mode = "w";
        }
        if ($append) {
			$file = @fopen($append,$mode);

			if (flock($file, LOCK_EX)) {
				fwrite($file,$contents);
				flock($file, LOCK_UN);
			    $er = $er . " SUCCESS - got and released lock append!";
			} else {
				$er = $er . " Could not get lock for append!\n";
			}
			fclose($file);
        }
        outputResponse($er);
} else if ($type == "load") {
        $contents = file_get_contents($name);
        outputResponse($contents);
}





?>
