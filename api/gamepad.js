// GAMEPAD API CLASS
// FOR THEBOX PROJECT
// BY LEONE
// v1.0

var gamepad = require("gamepad");

var	KEYS_AXIS = [];
// KEYMAPS FOR SONY DS4 CONTROLLER //
// WORKING WITH DS4DRV
// AXIS VALUES
KEYS_AXIS[9] = "KEY_AXIS_X"; // 6 default dont work with ds4Drv correct value 9  //
KEYS_AXIS[10] = "KEY_AXIS_Y"; // 7 default dont work with ds4Drv correct value 10 //
//KEYS_AXIS[3] = "L2_AXIS";
//KEYS_AXIS[4] = "R2_AXIS";
KEYS_AXIS[0] = "STICK[L]_AXIS_X"; // ds4Drv X + Y work with 1 and 0 //
KEYS_AXIS[1] = "STICK[L]_AXIS_Y";
KEYS_AXIS[2] = "STICK[R]_AXIS_X"; // Same as left stick //
KEYS_AXIS[5] = "STICK[R]_AXIS_Y";
//KEYSMAP["FINGER_ON_PAD"] = 8;
// BOOL VALUES
var KEYS_BUTTON = [];
KEYS_BUTTON[1] = "BUTTON_BOT";
//KEYS_BUTTON[0] = "BUTTON_LEFT";
//KEYS_BUTTON[3] = "BUTTON_TOP";
KEYS_BUTTON[2] = "BUTTON_RIGHT";
/*
 * to refind
KEYS_BUTTON["BUTTON_STICK[L]"] = 10;
KEYS_BUTTON["BUTTON_SICK[R]"] = 11;
KEYS_BUTTON["CLICK_PAD"] = 13;
*/
//KEYS_BUTTON[4] = "BUTTON_L1";
//KEYS_BUTTON[6] = "BUTTON_L2";
//KEYS_BUTTON[5] = "BUTTON_R1";
//KEYS_BUTTON[7] = "BUTTON_R2";



function	gamepadAPI() {
	this.init = function() {
		gamepad.init();
		setInterval(gamepad.processEvents, 30);
		setInterval(gamepad.detectDevices, 500);
	}
	
	this.Input = function(callback) {
		gamepad.on('move', function(player_id, axis, value) {
			if (typeof KEYS_AXIS[axis] != 'undefined') {
				callback(0, KEYS_AXIS[axis], value);
			}
		});
		gamepad.on('down', function(player_id, value) {
			if (typeof KEYS_BUTTON[value] != 'undefined') {
				callback(1, KEYS_BUTTON[value], 1);
			}
		});
		/*
		gamepad.on('up', function(player_id, value) {
		});
		*/
	}
	this.getKeys = function(){
		var ret = [];
		ret["KEYS_AXIS"] = KEYS_AXIS;
		ret["KEYS_BUTTON"] = KEYS_BUTTON;
		return (ret);
	}
	this.init();
}

module.exports = gamepadAPI;
