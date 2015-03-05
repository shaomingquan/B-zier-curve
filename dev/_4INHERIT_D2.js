// _INHERIT_D2.js
(function(){
	for(func in twoDimension.prototype){
		console.log(func);
		polygon.prototype[func] = twoDimension.prototype[func];
		rect.prototype[func] = twoDimension.prototype[func];
		arc.prototype[func] = twoDimension.prototype[func];
		path.prototype[func] = twoDimension.prototype[func];
		img.prototype[func] = twoDimension.prototype[func];
		curve.prototype[func] = twoDimension.prototype[func];
		text.prototype[func] = twoDimension.prototype[func];
	}
})();