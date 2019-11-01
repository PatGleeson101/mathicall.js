/*MathicallJS item: input.js
Handles mouse and keyboard input

Notes:
Currently only accurate for QWERTY keyboard layout (uses event.code)

Dependencies: None
*/

var input = (function(){
	"use strict";

	class PrimaryHandler {
		constructor() {
			//Input-state storage
			this.keyData = {};
			this.mouseData = {x: null, y:null, down:null};

			//Initialise user's event handlers
			let placeHolderFunc = function() {/*Do nothing*/}
			this.mouseDownHandler = placeHolderFunc;
			this.mouseUpHandler = placeHolderFunc;
			this.mouseMoveHandler = placeHolderFunc;
			this.dragHandler = placeHolderFunc;
			this.keyDownHandler = placeHolderFunc;
			this.keyUpHandler = placeHolderFunc;

			let inputHandler = this;
			window.onkeydown = function(e) {
				let code = e.code;
				if (inputHandler.keyData[code] !== undefined) {
					inputHandler.keysDown[code].down = true;
				} else {
					inputHandler.keyData[code] = {tracking: false, down: true};
				}

				if (inputHandler.keyData[code].tracking) {
					inputHandler.keyDownHandler(e);
				}

			};
			
			window.onkeyup = function(e) {
				let code = e.code;
				if (inputHandler.keyData[code] !== undefined) {
					inputHandler.keysDown[code].down = false;
				} else {
					inputHandler.keyData[code] = {tracking: false, down: false};
				}

				if (inputHandler.keyData[code].tracking) {
					inputHandler.keyUpHandler(e);
				}

			};
			//window.onkeypress = function(e) {};

			window.onmousedown = function() {
				inputHandler.mouseData.down = true;
				inputHandler.mouseDownHandler();
			}

			window.onmouseup = function() {
				inputHandler.mouseData.down = false;
				inputHandler.mouseUpHandler();
			}

			window.onmousemove = function(e) {
				if (inputHandler.mouseData.down) {
					inputHandler.dragHandler(e.clientX-inputHandler.mouseData.x, e.clientY-inputHandler.mouseData.y);
				}
				inputHandler.mouseData.x = e.clientX;
				inputHandler.mouseData.y = e.clientY;
				inputHandler.mouseMoveHandler();
			}
		}

		getRelMousePos(element) { 
			//From top left corner; +x -> right; +y -> down
			let offSet = element.getBoundingClientRect();
			let xOff = offSet.left;
			let yOff = offSet.top;
			let absX = this.mouseData.x;
			let absY = this.mouseData.y;

			//Return x & y of mouse within the element
			return {x: absX-xOff, 
					y: absY-yOff};
		}
	}

	return {
		PrimaryHandler: PrimaryHandler
	};
}());
