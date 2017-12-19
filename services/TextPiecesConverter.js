const XRegExp = require('xregexp');
const _ = require('lodash');

class TextPiecesConverter {

	static convertPiecesToText(pieces) {
		var text = '';
		for(var i = 0; i < pieces.length; ++i){
			text += pieces[i].d;
		}
		return text;
	}

	static convertTextToPieces(text) {
		text += '\n\n'; // necessary to catch the last word of the text...
		var pieces = [];
		var inWord = false;
		var buffer = '';
		var unicodeLetter = XRegExp('^\\pL$');

		for(var i = 0; i < text.length; ++i){
			var c = text[i];
			var isLetter = unicodeLetter.test(c);
			var isWhitespace = ('\t\r'.indexOf(c) > 0);
			var isNewline = (c == '\n');
			if(!inWord && isWhitespace){
				continue;
			}
			if(!inWord && isNewline){
				pieces.push({d: buffer});
				pieces.push({d: '\n'});
				buffer = '';
			}
			if(inWord != isLetter){
				if(inWord){
					pieces.push({d: buffer, w: buffer.toLowerCase()});
				} else {
					pieces.push({d: buffer});
				}
				inWord = !inWord;
				buffer = c;
			} else {
				buffer += c;
			}
		}
		return pieces;
	}

	static extractWordListFromPieces(json){
		let words = json.filter(piece => piece.w !== undefined).map(piece => piece.w);
		return _.uniq(words).sort();
	}
}

module.exports = TextPiecesConverter;
