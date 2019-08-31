/* MathicallJS item: mathparser.js
A module to parse string maths expressions into usable forms
*/

var mathParser = (function() {
	"use strict";

	//Setup allowed characters and tokens
	let digits = ['0','1','2','3','4','5','6','7','8','9'];
	let letters = ['a','b','c','d','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
	let operators = ['+','-','*','/','^'];
	let brackets = ['(',')'];
	let separators = [','];
	let functions = ['sin','cos','abs','max','min'];
	let actions = [];

	//Setup token recognition (outside of tokenize function so that pushToken can be defined)
	let tokenStruct;
	let token;
	let tokenType;

	function pushCurrentToken() {
		if (tokenType === 'letters') {
			if (functions.includes(token)) {
				tokenStruct.push(token);
			} else {
				for (let i = 0; i < token.length-1; i++) {
					tokenStruct.push(token[i]);
					tokenStruct.push('*');
				}
				tokenStruct.push(token[token.length-1]);
			}
		} else if (token === '') {

		} else {
			tokenStruct.push(token);
		}
		tokenType = null;
		token = '';
	}
	
	function tokenizeMathExp(string) {
		//Setup input string
		let inputExp = string.replace(" ","");
		let len = inputExp.length;

		//Setup token storage
		tokenStruct = [];
		token = '';
		tokenType = null;

		for (let i = 0; i < len; i++) {
			let char = inputExp[i];

			if (digits.includes(char)) { //Check if character is a digit
				//Add to current token, if valid
				if (tokenType === null) {
					tokenType = 'number';
					token += char;
				} else if (tokenType === 'number') {
					token += char;
				} else {
					throw 'Invalid maths expression: contains misplaced digit';
				}

			} else if (letters.includes(char)) { //Check if character is a letter
				//Add to current token if valid
				if (tokenType === null) {
					tokenType = 'letters';
					token += char;
				} else if (tokenType === 'letters') {
					token += char;
				} else { //Assume implicit multiplication
					pushCurrentToken();
					tokenStruct.push('*');
					tokenType = 'letters';
					token = char;
				}

			} else if (operators.includes(char)) {
				pushCurrentToken();
				tokenStruct.push(char);

			} else if (char === '(') { //Check if character is a left bracket
				pushCurrentToken();
				if (!functions.includes(tokenStruct[tokenStruct.length-1])) {
					tokenStruct.push('*');
				} 
				tokenStruct.push('(');

			} else if (char === ')') {
				pushCurrentToken();
				tokenStruct.push(')');

			} else if (separators.includes(char)) {
				pushCurrentToken();
				tokenStruct.push(char);

			} else {
				throw 'Invalid maths expression: contains invalid character';
			}
		}
		//Push final token
		pushCurrentToken();

		return tokenStruct;
	}

	function tokensToPostfixNotation(tokenStruct) {

	}

	function evalPostfixStruct() {

	}

	return {tokenize: tokenizeMathExp}
}());