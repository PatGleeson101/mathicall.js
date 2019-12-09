/* MathicallJS item: input.js
Handles mouse and keyboard input

Dependencies: None

Notes:
TO-DO:
- implement default callback for randash's internalRand function
- determine whether to clear the mouse position when clear() called
*/

var input = (function(){
	"use strict";

	//Data storage
	const keyDownCallbacks = {};
	const anyKeyDownCallbacks = {};
	const keyUpCallbacks = {};
	const anyKeyUpCallbacks = {};
	const keyStates = {};

	let mouseDownCallbacks = [];
	let mouseUpCallbacks = [];
	let mouseMoveCallbacks = [];
	let mouseState = false;
	const prevMousePos = {x: 0, y: 0};
	const mousePos = {x: 0, y: 0};


	//Initialisation
	function initialiseKey(key, state = false) {
		keyDownCallbacks[key] = [];
		keyUpCallbacks[key] = [];
		keyStates[key] = state;
	}

	function checkKey(key, state = false) {
		if (keyStates[key] === undefined) {
			initialiseKey(key, state);
		}
	}

	function runCallbacks(e, callbacks) {
		const len = callbacks.length;
		for (let i = 0; i < len; i++) {
			callbacks[i](e);
		}
	}

	function start() {
		//Internal Mouse Handling
		window.onmousedown = function(e) {
			mouse_State = true;
			runCallbacks(e, mouseDownCallbacks);
		}

		window.onmouseup = function(e) {
			mouseState = false;
			runCallbacks(e, mouseUpCallbacks);
		}

		window.onmousemove = function(e) {
			prevMousePos.x = mousePos.x;
			prevMousePos.y = mousePos.y;
			mousePos.x = e.clientX;
			mousePos.y = e.clientY;
			runCallbacks(e, mouseMoveCallbacks);
		}


		//Internal Key Handling
		window.onkeydown = function(e) {
			const key = e.key;
			if (keyStates[key] !== true) {
				//State & initialisation
				checkKey(key, true);
				keyStates[key] = true;
				//Callbacks
				runCallbacks(e, keyDownCallbacks[key]);
			}
			//Call anyKeyDown callbacks
			runCallbacks(e, anyKeyDownCallbacks);
		};

		window.onkeyup = function(e) {
			const key = e.key;
			if (keyStates[key] !== false) {
				//State & initialisation
				checkKey(key, false);
				keyStates[key] = false;
				//Callbacks
				runCallbacks(e, keyUpCallbacks[key]);
			}
			//Call anyKeyUp callbacks
			runCallbacks(e, anyKeyUpCallbacks);
		};
	}

	function stop() {
		window.onmousedown = null;
		window.onmouseup = null;
		window.onmousemove = null;
		window.onkeydown = null;
		window.onkeyup = null;
	}

	function clear() {
		keyDownCallbacks = {};
		anyKeyDownCallbacks = {};
		keyUpCallbacks = {};
		anyKeyUpCallbacks = {};
		keyStates = {};

		mouseDownCallbacks = [];
		mouseUpCallbacks = [];
		mouseMoveCallbacks = [];
		mouseState = false;
		//CURRENTLY DOES NOT CLEAR MOUSE POSITION
	}

	//User accessible mouse handling
	function mouse_State() {
		return mouseState;
	}

	function mouse_Pos(element = window) {
		//From top left corner; +x -> right; +y -> down
		const offSet = element.getBoundingClientRect();
		//Return x & y of mouse within the element
		return {x: mousePos.x - offSet.left, 
				y: mousePos.y - offSet.top};
	}

	function addMouseDownCallback(callback) {
		mouseDownCallbacks.push(callback);
	}

	function addMouseUpCallback(callback) {
		mouseUpCallbacks.push(callback);
	}

	function addMouseMoveCallback(callback) {
		mouseMoveCallbacks.push(callback);
	}

	function removeMouseDownCallback(callbackRef) {
		const index = mouseDownCallbacks.lastIndexOf(callbackRef);
		if (index > -1) {
			mouseDownCallbacks.splice(index, 1);
		}
	}

	function removeMouseUpCallback(callbackRef) {
		const index = mouseUpCallbacks.lastIndexOf(callbackRef);
		if (index > -1) {
			mouseUpCallbacks.splice(index, 1);
		}
	}

	function removeMouseMoveCallback(callbackRef) {
		const index = mouseMoveCallbacks.lastIndexOf(callbackRef);
		if (index > -1) {
			mouseMoveCallbacks.splice(index, 1);
		}
	}


	//User accessible key handling
	function keyState(key) {
		checkKey(key);
		return keyStates[key];
	}

	function addKeyDownCallback(callback, ...keys) {
		const keyCount = keys.length;
		if (keyCount === 0) {
			anyKeyDownCallbacks.push(callback);
		} else {
			for (let i = 0; i < keyCount; i++) {
				const key = keys[i];
				checkKey(key);
				keyDownCallbacks[key].push(callback);
			}
		}
	}

	function addKeyUpCallback(callback, ...keys) {
		const keyCount = keys.length;
		if (keyCount === 0) {
			anyKeyUpCallbacks.push(callback);
		} else {
			for (let i = 0; i < keyCount; i++) {
				const key = keys[i];
				checkKey(key);
				keyUpCallbacks[key].push(callback);
			}
		}
	}

	function removeKeyDownCallback(callbackRef, ...keys) {
		const keyCount = keys.length;
		if (keyCount === 0) {
			const index = anyKeyDownCallbacks.lastIndexOf(callbackRef);
			if (index > -1) {
				anyKeyDownCallbacks.splice(index, 1);
			}
		} else {
			for (let i = 0; i < keyCount; i++) {
				const key = keys[i];
				checkKey(key);
				const index = keyDownCallbacks[key].lastIndexOf(callbackRef);
				if (index > -1) {
					keyDownCallbacks[key].splice(index, 1);
				}
			}
		}
	}

	function removeKeyUpCallback(callbackRef, ...keys) {
		const keyCount = keys.length;
		if (keyCount === 0) {
			const index = anyKeyUpCallbacks.lastIndexOf(callbackRef);
			if (index > -1) {
				anyKeyUpCallbacks.splice(index, 1);
			}
		} else {
			for (let i = 0; i < keyCount; i++) {
				const key = keys[i];
				checkKey(key);
				const index = keyUpCallbacks[key].lastIndexOf(callbackRef);
				if (index > -1) {
					keyUpCallbacks[key].splice(index, 1);
				}
			}
		}
	}

	//Return public functions
	return {
		mousePos: mouse_Pos,
		mouseState: mouse_State,
		addMouseDownCallback: addMouseDownCallback,
		addMouseUpCallback: addMouseUpCallback,
		addMouseMoveCallback: addMouseMoveCallback,
		removeMouseDownCallback: removeMouseDownCallback,
		removeMouseUpCallback: removeMouseUpCallback,
		removeMouseMoveCallback: removeMouseMoveCallback,
		start: start,
		stop: stop,
		clear: clear,
		keyState: keyState,
		addKeyDownCallback,
		addKeyUpCallback,
		removeKeyDownCallback,
		removeKeyUpCallback
	};
}());