<?php
	require_once('lib/tor.class.php');

	$tor = new Tor\Control('localhost', 9051);
	$tor->authenticate('your_password');
	$tor->clean_output = true;

	$json = array();
	list($json['usedUpload'], $json['usedDownload']) = explode(' ', $tor->getinfo('accounting/bytes'));
	list($json['leftUpload'], $json['leftDownload']) = explode(' ', $tor->getinfo('accounting/bytes-left'));
	foreach ($json as &$value) {
		$value = (float)$value;
	}
	$connections = $tor->getinfo('orconn-status');
	$json['connections'] = substr_count($connections, 'CONNECTED');
	$json['hibernating'] = ($tor->getinfo('accounting/hibernating') === 'awake') ? false : true;
	$tor->quit();
	
	echo json_encode($json);
?>