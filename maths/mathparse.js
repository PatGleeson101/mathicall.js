/* MathicallJS module: mathparse.js
A module to parse string maths expressions into usable forms

Dependencies: None
*/

var mathparse = (function() {
	"use strict";

	//Define and categorise recognised tokens (single characters or multiple letters)
	let digits = ['0','1','2','3','4','5','6','7','8','9'];
	let letters = ['a','b','c','d','h','i','j','k','l','m',
				   'n','o','p','q','r','s','t','u','v','w','x','y','z',
				   'A','B','C','D','E','F','G','H','I','J','K','L','M',
				   'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	
	let operators = ['+','-','*','/','^'];

	let specials = ['(',')',',']; //To keep track of characters with explicitly-coded functionality

	let functions = ['sin','cos','abs','max','min'];
	let actions = [];

	let precedences = {'+':0,
					   '-':0,
					   '*':1,
					   '/':1,
					   '^':2};

	//Setup token recognition (outside of tokenize function so that pushToken can be defined)
	let actionStack;
	let valueStack;
	let token;
	let tokenType;

	function useOperator(operator) { //Currently nonfunctional for variables
		if (operator === '+') {
			valueStack.push(valueStack.pop()+valueStack.pop());
		} else if (operator === '-') {
			valueStack.push(-1*valueStack.pop()+valueStack.pop());
		} else if (operator === '*') {
			valueStack.push(valueStack.pop()*valueStack.pop());
		} else if (operator === '/') {
			valueStack.push(1/valueStack.pop()*valueStack.pop());
		} else if (operator === '^') {
			let exponent = valueStack.pop();
			valueStack.push(Math.pow(valueStack.pop(),exponent));
		}
	}

	function pushOperator(operator) {
		let tokPrec = precedences[operator];
		for (let i = actionStack.length-1; i >= 0; i--) { //Iterate backwards over actionStack
			if (tokPrec <= precedences[actionStack[i]]) {
				useOperator(actionStack.pop());
			} else {
				break;
			}
		}
		actionStack.push(operator);
	}

	function pushToken(tok, tokType) {
		if (tokType === 'letters') { //If token is made of letters:
			if (functions.includes(tok)) { //If token is a function:
				actionStack.push(tok); //ADD FUNCTION HERE
			} else { //Token must be a sequence of implicitly-multiplied variables:
				for (let i = 0; i < tok.length-1; i++) {
					valueStack.push(tok[i]);
					actionStack.push('*');
				}
				valueStack.push(tok[tok.length-1]);
			}
		} else if (tokType === 'int') {
			valueStack.push(parseInt(tok));
		} else if (tokType === 'float') {
			valueStack.push(parseFloat(tok));
		} else if (tokType === 'operator') {
			pushOperator(tok);
		} else if (tokType === null) {
			//Do nothing; no token was pushed
		} else {
			throw 'Invalid token type';
		}

		tokenType = null;
		token = '';
	}
	
	function evalExp(string, mode = 'literal') {
		//Setup input string
		let inputExp = string.replace(" ","");
		let len = inputExp.length;

		//Clear old token storage
		valueStack = [];
		actionStack = [];
		token = '';
		tokenType = null;

		//Special storage
		let wasOperator = false;

		//Iterate over each character in input expression
		for (let i = 0; i < len; i++) {
			let char = inputExp[i]; //Get character

			//Numerical checks
			if (digits.includes(char)) { //If character is a digit:
				wasOperator = false;
				//Add to current token, if valid
				if (tokenType === null) { //No existing token:
					tokenType = 'int';
					token += char;
				} else if ((tokenType === 'int')||(tokenType = 'float')) {//Existing numerical token:
					token += char;
				} else { //Digit is invalid
					throw 'Invalid maths expression: contains miscellaneous digit';
				}
			} else if (char === '.') { //If character is a decimal point:
				if (tokenType === null) { //No existing token:
					tokenType = 'float';
					token += '0.'; //Begin new float with a 0.
				} else if (tokenType === 'int') {//Existing integer token:
					tokenType = 'float';
					token += char;
				} else { //Decimal point is invalid
					throw 'Invalid maths expression: contains miscellaneous decimal point';
				}

			//Variable & Function checks:
			} else if (letters.includes(char)) { //Check if character is a letter
				wasOperator = false;
				//Add to current token if valid
				if (tokenType === null) {
					tokenType = 'letters';
					token += char;
				} else if (tokenType === 'letters') {
					token += char;
				} else { //Assume implicit multiplication between current token and new letter token
					pushToken(token, tokenType); //Push current token
					pushToken('*', 'operator'); //Push * operator to actionStack
					tokenType = 'letters'; //Begin new letter-based token
					token = char;
				}

			//Operator checks
			} else if (operators.includes(char)) {
				wasOperator = true;
				pushToken(token, tokenType);
				pushOperator(char);

			//Special checks: separators & brackets
			} else if (char === '(') { //If character is an opening bracket:
				pushToken(token, tokenType);
				if ((!functions.includes(valueStack[valueStack.length-1]))&&(i>0)&&(!wasOperator)) { //If previous token exists and is not a function
					pushOperator('*');
				} 
				actionStack.push('(');
				wasOperator = true;

			} else if (char === ')') { //If character is a closing bracket:
				pushToken(token, tokenType);
				for (let i = actionStack.length-1; i >= 0; i--) { //Iterate backwards over actionStack
					let action = actionStack.pop(); //Currently risky: won't catch errors (misplacecd brackets)
					if (action === '(') {
						break;
					} else {
						useOperator(action);
					}
				}

			} else if (separators.includes(char)) { //If character is a comma (separator):
				pushToken(token, tokenType);
				actionStack.push(char);
				wasOperator = true;

			//Character is not recognised:
			} else {
				throw 'Invalid maths expression: contains invalid character';
			}
		}

		//Push final token
		pushToken(token, tokenType);

		//Use remaining operators
		for (let i = actionStack.length-1; i >= 0; i--) { //Iterate backwards over actionStack
			useOperator(actionStack.pop());
		}

		return valueStack;
	}

	return {
		eval: evalExp
			};
}());