// _D2.js
// configDemo = {
// 	posi:{
// 		x , y 
// 	},
// 	offset:{}
// 	rotate:{deg},
// 	scale:{x,y},
// 	opcity:
// 	stroke:{
// 		style
// 	},
// 	fill:{
// 		style
// 	},
// 	shadow:{
// 		color,
// 		blur,
// 		offsetX,
// 		offsetY
// 	},
// 	line:{

// 	}
// }
/**  
* @author shaomingquan  
* @constructor twoDimension  
* @class 2D
* @pravite
* @description subclass of specific shape
* @type twoDimension 
* @param {MC} MC what the shape belong to
* @param {HTMLCanvasElement} canvas your canvas
* @param {CanvasRenderingContext2D} c CanvasRenderingContext2D of canvas
* @param {json} config shape config
* @param {json} info shape info
*/  

function twoDimension(MC ,canvas , c, config ,info){
	this.display = "hidden";
	this.MC = MC;
	this.canvas = canvas ;
	this.c = c;
	// this.posi = [0,0];
	// this.offset = [0,0];
	// this.scale = [1,1];
	// this.rotate = 0
	// this.opcity = 255;
	this.posi = [0,0];
	this.animator = new Animator();
	this.anis = [];

	this.MC.delay(1);
	this.shapeId = new Date().valueOf();

	var MCIds = MC.ids,
		MCClasses = MC.classes,
		MCIdLength = MCIds.length,
		index = 0;

	this.MC.shapes.push(this);

	switch(this.constructor){
		case polygon : {
			this.MC["polygons"].push(this);
			break;
		}case arc : {
			this.MC["arcs"].push(this);
			break;
		}case path : {
			this.MC["paths"].push(this);
			break;
		}case img : {
			this.MC["imgs"].push(this);
			break;
		}case curve : {
			this.MC["curves"].push(this);
			break;
		}case text : {
			this.MC["texts"].push(this);
			break;
		}
	}

	if(config)
		tranConfig : for(attr in config){
			this[attr] = config[attr];
		}
	this.index = this.index || 0;
	if(info)
		tranInfo : for(attr in info){
			if(attr == "id"){
				var id = info[attr];
				for( ; index < MCIdLength ; index ++){
					if(MCIds[index] == id){
						console.error("exist id!!!");
						return false;
					}
				}
				MCIds[id] = this;
			}
			if(attr == "class"){
				var cla = info[attr];
				if(!MCClasses[cla]){	
					MCClasses[cla] = [];				
					MCClasses[cla].push(this);
				}else{
					MCClasses[cla].push(this);
				}
			}
			this[attr] = info[attr];
		}
}
/**
*@method ani
*@memberof twoDimension
*@instance
*@param {json} target property, the same format as config of shape
*@param {int} time during transition
*@param {string | Array} aniFunc animation function, string for specific method, Array for Three Bessel curve
*@param {Function} execute when corresponding animation is over
*@type twoDimension
*/
twoDimension.prototype.ani = function(property, duration, aniFunc, callback){
	var animator = this.animator,
		_this = this,
		property = property,
		options = this.alterCallback( duration, aniFunc, callback ),
		curFunc = function(){
			for( attr in property ){
				var fx = null,
					start = [] ,
					end = [],
					elem = _this;
				fx = new Animator.Fx(elem ,options ,attr );
				_this.anis.push(fx);
				(property[attr] instanceof Array ? function(){
					start[0] = elem[attr][0];
					start[1] = elem[attr][1];
					end[0] = property[attr][0];
					end[1] = property[attr][1];
				} : function(){
					start = elem[attr];
					end = property[attr];
				})();
				fx.begin(start ,end);
			}
		};
	if(!animator.started){
		animator.started = true;
		curFunc();
		return this;
	}
	animator.enqueue(curFunc);
	return this;
}

twoDimension.prototype.alterCallback = function ( duration ,aniFunc ,callback){
	return {
		duration : duration,
		aniFunc : aniFunc,
		callback : function(){
			var animator = this;
			callback && callback();
			if(!animator.isEmpty()){
				(animator.dequeue())();
			}else{
				animator.started = false;
			}
		}
	}
}
/**
*@memberof twoDimension
*@method stop
*@instance
*@type twoDimension
*/
twoDimension.prototype.stop = function(){
	var length = this.anis.length,
		anis = this.anis;
	for(var i = 0 ; i < length ; i++){
		anis[i].stop(this);
	}
	this.animator.dequeue();
	this.animator.started = false;
	return this;
}
/**
*@memberof twoDimension
*@method bind
*@instance
*@param {string} type now only click
*@param {Function} execute when corresponding event is trigger
*@type twoDimension
*/
twoDimension.prototype.bind = function(type,callback) {
	if(!callback){
		console.error("where is your callback?");
	}
	switch(type){
		case "click" : clicked.call(this,callback); break;
		case "keypress" : keypress.call(this,callback); break; 
	}
	function clicked(callback){
		var _this = this;
		this.MC.addEvent(_this.shapeId ,type ,function(e){
			e = e || event;
			var x = e.layerX;
			var y = e.layerY;
			_this.draw();
			if(_this.c.isPointInPath(x,y)){
				callback.call(_this,e);
			}
			_this.MC.drawAll();
		});
	}
	return this;
	
}
/**
*@memberof twoDimension
*@method bind
*@instance
*@param {string} type now only click
*@param {Function} execute when corresponding event is removed
*@type twoDimension
*/
twoDimension.prototype.unbind = function (type ,callback) {
	this.MC.removeEvent(this.shapeId,type);
	if(callback){
		callback.call(this);
	}
	return this;
}
/**
*@memberof twoDimension
*@method hidden
*@instance
*@type twoDimension
*/
twoDimension.prototype.hidden = function(){
	this.display = "hidden";
	this.MC.drawAll();
	if(arguments[0] && arguments[0] instanceof Function){
		arguments[0].call(this);
	}
	return this;
}

/**
*@memberof twoDimension
*@method hidden
*@instance
*@type twoDimension
*/
twoDimension.prototype.show = function(){
	this.display = "show";
	this.MC.drawAll();
	if(arguments[0] && arguments[0] instanceof Function){
		arguments[0].call(this);
	}
	return this;
}

twoDimension.prototype.callbackRedraw = function(obj ,ifRedraw){
	ifRedraw ? (function(arg0){
		if(arg0 instanceof Function){
			obj.callback = arg0;
			obj.redrawFlag = false;
		}else{
			obj.redrawFlag = arg0;
		}
	})(ifRedraw) : false;
}

twoDimension.prototype.drawProcessing = function(callback ,redrawFlag) {

	this.c.save();
	this.display = "show";

	if(this.posi){					
		this.c.translate(this.posi[0] || 0 ,this.posi[1] || 0);
	}
	if(this.rotate){					
		this.c.rotate(this.rotate/180*Math.PI || 0);
	}
	if(this.scale){
		this.c.scale(this.scale[0] || 1 ,this.scale[1] || 1);
	}
	if(this.opcity){
		this.c.globalAlpha=this.opcity || 255;
	}
	if(this.stroke){
		this.c.strokeStyle = this.stroke || "#000";
	}
	if(this.fill){
		this.c.fillStyle = this.fill || null;
	}
	if(this.shadow){
		this.c.shadowColor = this.shadow[0] || null;
		this.c.shadowBlur = this.shadow[1] || null;
		this.c.shadowOffsetX = this.shadow[2] || null;
		this.c.shadowOffsetY = this.shadow[3] || null;
	}
	if(this.line){
		this.c.lineWidth = this.line.width || 1;
		this.c.lineCap = this.line.cap || null;
		this.c.lineJoin = this.line.join || null;
	}

	this.c.beginPath();
	callback();
	if(this.stroke){	
		this.c.stroke();
	}
	if(this.fill){
		this.c.fill();
	}
	this.c.restore();
	if(redrawFlag){
		return false;
	}
	this.MC.drawAll();
	return true;
};
