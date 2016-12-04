<?php
namespace Tor;
	set_exception_handler( array('Tor\Exception', 'getStaticException') );

	define('S2K_SPECIFIER_LEN', 9);
	define('DIGEST_LEN', 20);
	define('VERSION', '0.2.1.3');

	class Exception extends \Exception
	{
		private $html = '<p style="font-family: monospace; border: 1px solid #F00; background-color: #F33; color: #FFF; padding: 2px; padding-left: 20px; margin: 5px">%s</p>';

		public function __construct($message, $code = null)
		{
			parent::__construct($message, $code);
		}

		public function __toString()
		{
			$output = ob_get_contents();
			ob_clean();
			return sprintf( $this->html, 'Error! Code ' . $this->getCode() . ' with following message: ' . htmlentities( $this->getMessage() ) ) . $output;
		}

		public function getExceptionAndQuit() {
			die($this);
		}

		public function getException() {
			print $this;
		}

		public static function getStaticException($exception) {
			$exception->getException();
		}
	}

	class Control {
		private $fp = null;
		private $auth = false;
		private $connected = false;
		private $events_pool = null;
		private $protocol_info = array();
		public $clean_output = false;

		public function __construct($server = 'localhost', $port = 9051) {
			if ( ($this->fp = fsockopen($server, $port, $errno, $errstr, 30) ) === false) {
				throw new Exception($errstr, $errno);
			}
			$this->connected = true;
			$this->protocol_info = $this->protocolinfo();
		}

		public function __destruct() {
			if( isset($this->fp) && $this->connected )
				$this->quit();
		}

		// strstr equivalent, but without separator(hence *ws).
		private function strstrws($string, $separator = '=', $before_separator = false) {
			if ( ( $value_pos = strpos($string, $separator) ) !== false )
				return ($before_separator) ? substr($string, 0, $value_pos) : substr($string, $value_pos + 1);
			else
				return false;
		}
		
		private function protocolinfo() {
			$pi = array();

			$reply = $this->send("PROTOCOLINFO\r\n");
			if ($reply == -1) {
				return false;
			}
			while( $r = $this->recieve() ) {
				$reply .= $r;
			}
			$protocolinfo = explode("\r\n", $reply);
			$protocolinfo = array_filter($protocolinfo, 'strlen');
			foreach ($protocolinfo as $line) {
				$line = explode(' ', $line);
				$keyword = array_shift($line);
				$args = array();
				foreach ($line as $arg) {
					if ( strpos($arg, '=') === false ) {
						$args = $arg;
					} else {
						$args[$this->strstrws($arg, '=', true)] = ( strpos($arg, ',') === false ) ? $this->strstrws($arg) : explode( ',', $this->strstrws($arg) );
					}
				}
				$pi[$keyword] = $args;
			}

			return $pi;
		}

		public function authenticate($secret = null) {
			if ( is_null($secret) ) {
				$secret = Crypt\secret_gen();
				$key = strtoupper( Crypt\s2k_gen($secret) );
				throw new Exception("No password specified! Paste this in you torrc file: \"$key\" to use \"$secret\" as your password.");
			}
			if ( $this->send("AUTHENTICATE \"$secret\"\r\n") != -1 ) {
				$this->auth = true;
			}
			return $this->auth;
		}

		public function getinfo($keyword = null) {
			$reply = $this->send("GETINFO $keyword\r\n");
			if ($reply == -1) {
				return false;
			}
			while( $r = $this->recieve($keyword) ) {
				$reply .= $r;
			}
			$reply = explode('=', $reply, 2);
			return $reply[1];
		}

		public function signal($signal = null) {
			if ( $this->send("SIGNAL \"$signal\"\r\n" == -1) ) {
				return false;
			} else {
				return true;
			}
		}

		public function getconf($keyword = null) {
			$reply = $this->send("GETCONF $keyword\r\n");
			if ($reply == -1) {
				return false;
			}
			$reply = explode('=', $reply, 2);
			return $reply[1];
		}

		public function extendcircuit($id = 0) {
			if ($this->send("EXTENDCIRCUIT $id\r\n") == -1) {
				return false;
			} else {
				return true;
			}
		}

		public function quit() {
			$this->send("QUIT\r\n");
			fclose($this->fp);
			unset($this->fp);
		}

		public function lastevents() {
			if ( is_null($this->events_pool) ) {
				return false;
			}
			$lastevents = $this->events_pool;
			$this->events_pool = null;
			return $lastevents;
		}

		public function send($command = null) {
			fputs($this->fp, $command);
			try {
				$result = $this->recieve();
			} catch (Exception $e) {
				if ($this->connected) {
					$e->getException();
				} else {
					$e->getExceptionAndQuit();
				}
				return -1;
			}
			return $result;
		}

		public function recieve() {
			$reply = fgets($this->fp);
			if ($reply === false) {
				$this->connected = false;
				throw new Exception('Lost connection to the server!', 5);
			}
			$code = substr($reply, 0, 3);
			$separator = substr($reply, 3, 1);
			while( $separator == '+' && rtrim($r = fgets($this->fp)) != '.' ) {
				$reply .= $r;
			}
			list($code, $message) = explode($separator, $reply, 2);
			switch($code) {
				case 250:
					if ( rtrim($message) == 'OK' ) {
						return false;
					} else {
						return $this->clean_output ? rtrim($message) : $message ;
					}
					break;
				case 640:
					$this->events_pool .= $message;
					break;
				default:
					throw new Exception($message, $code);
					break;
			}
		}
	}

namespace Tor\Crypt;
	class SHA1Digest {
		private $data = null;

		public function update($data = null) {
			$this->data .= $data;
			return true;
		}

		public function digest() {
			return sha1($this->data, true);
		}
	}

	function secret_gen($length = 10) {
		$secret = null;

		$char_arr = array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');
		foreach ($char_arr as $char) {
			$char_arr[] = strtoupper($char);
		}

		$char_num = key( array_slice($char_arr, -1, 1, true) );
		for ($i = 0; $i < $length; $i++) {
			$secret .= $char_arr[mt_rand(0, $char_num)];
		}

		return $secret;
	}

	function secret_to_key($secret, $s2k_specifier) {
		$c = ord( $s2k_specifier{8} );

		defined('EXPBIAS') || define('EXPBIAS', 6);
		$count = (16 + ($c & 15)) << (($c >> 4) + EXPBIAS);

		$d = new SHA1Digest();
		$tmp = substr($s2k_specifier, 0, 8) . $secret;
		$tmp_len = strlen($tmp);

		while($count) {
			if ($count >= $tmp_len) {
				$d->update($tmp);
				$count -= $tmp_len;
			} else {
				$d->update( substr($tmp, 0, $count) );
				$count = 0;
			}
		}
		return $d->digest();
	}

	// Based on rfc2440 3.6.1.3.
	// http://www.ietf.org/rfc/rfc2440.txt
	function s2k_gen($secret = null) {
		$urand = fopen('/dev/urandom', 'rb');
		$spec = fgets($urand, S2K_SPECIFIER_LEN);
		fclose($urand);
		$spec .= chr(96);

		return sprintf('16:%s', bin2hex( $spec . secret_to_key($secret, $spec) ) );
	}

	function s2k_check($secret, $key) {
		$k = substr($key, 3);
		$k = pack("H*", $k);
		return $this->secret_to_key($secret, substr($k, 0, 9)) == substr($k, 9);
	}
?>