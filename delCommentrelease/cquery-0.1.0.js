***********************************************************
***********************************************************

/**  
* @fileOverview
<ul>
	<li>
		<b>general introduce:</b>
		<ul>
			<li>I fell that it is fussy for canvas programming to invoke save and restore function</li>
			<li>So i write this totally a little less than 1000 lines</li>
			<li>It is simple now, i will make it better soon</li>
			<li>It may has some short-comings, welcome to give advice to me</li>
			<li>Welcome to contribute to it</li>
		</ul>
	</li>
	<li>
		<b>tips:</b>
		<ul>
			<li>
				<b>explain a argument called <i>config</i>:</b>
				<ul>
					<li><b>posi:</b>{x:double,y:double}</li>
					<li><b>offset:</b>{x:double,y:double}</li>
					<li><b>scale:</b>{x:double,y:double}</li>
					<li><b>rotate:</b>double(0~INFINITY)</li>
					<li><b>stroke:</b>string | Style</li>
					<li><b>fill:</b>string| Style</li>
					<li><b>opcity:</b>double(0~1)</li>
					<li><b>line:</b>{width:int,cap:string,join:string}</li>
					<li><b>shadow:</b>Array(length === 4)</li>
				</ul>
			</li>
			<li>
				thanks for <b>John Resig</b> author of jquery, the <b>chain operation</b> and the animation is learn by reading jquery source code
			</li>
		</ul>
	</li>
	<li>
		<b>later for next version:</b>
		<ul>
			<li>improve current methods</li>
			<li>add event methods</li>
			<li>add 3D shapes</li>
		</ul>
	</li>
</ul>
* @author {@link https:***********************************************************
* @version 0.1.0
*/

/**  
* @author shaomingquan  
* @constructor MC  
* @class MC
* @description main class of the cquery, one HTMLCanvasElement has only one MC object ,there are some methods provided by MC to darw shapes and make the shape do animation and stop    
* @example new MC(document.getElementById("canvasId")); 
* @type MC
* @param {HTMLCanvasElement} canvas your canvas object in dom  
*/  


function MC(canvas){
	***********************************************************
	/**
	* @memberof MC
	* @instance
	* @type Array(D2)
	* @description collection of D2 shapes in this MC
	*/
	this.shapes = [];

	***********************************************************
	this.polygons = [];
	this.arcs = [];
	this.paths = [];
	this.imgs = [];
	this.curves = [];
	this.texts = [];

	***********************************************************
	this.ids = {};
	this.classes = [];

	***********************************************************
	this.events = {};
	this.events.click = {};

	***********************************************************
	this.resourse = {};
	this.resourse.imgs = {};

	***********************************************************
	this.canvas = canvas;
	this.c = this.canvas.getContext("2d");
	console.log(this.c)

}

MC.prototype.drawAll = function (){
	var shapes = this.shapes,
		length = shapes.length,
		index = 0,
		indexTemp = 0,
		shapesTemp = [];
	for( ; index < length ; index++){
		if(shapes[index].display == "show"){
			shapesTemp[indexTemp] = shapes[index];
			indexTemp ++;
		}
	}
	shapesTemp.sort(function(obj1 ,obj2){
		return obj1.index > obj2.index;
	})
	this.c.clearRect(0,0,this.canvas.width,this.canvas.height);
	for( index = 0 ; index < indexTemp; index++){
		shapesTemp[index].draw("memeda");
	}
} 
/**
* @method polygon
* @memberof MC
* @instance
* @param {int} number_of_side the number of polygon sides
* @param {double} r distance between center of the shape and any point on the polygon
* @param {json} config config of shape 
* @type polygon
*/
MC.prototype.polygon = function (num_of_side, r ,config){
	return new polygon(num_of_side ,r ,this ,this.canvas , this.c, config);
}
/**
* @method rect
* @memberof MC
* @instance
* @param {double} width width of the rectagle 
* @param {double} height height of the rectagle
* @param {json} config config of shape 
* @type rect
*/
MC.prototype.rect = function (width ,height ,config){
	return new rect(width ,height ,this ,this.canvas ,this.c, config);
}
/**
* @method arc
* @memberof MC
* @instance
* @param {double} r radius of the arc 
* @param {double} startAngle startAngle of the arc
* @param {double} endAngle engAngle of the arc
* @param {boolean} mode direction of drawing arc, true for clockwise, false for anticlockwise
* @param {json} config config of shape 
* @type arc
*/
MC.prototype.arc = function (r ,startAngle ,endAngle ,mode ,config){
	return new arc(r ,startAngle ,endAngle ,mode ,this ,this.canvas ,this.c ,config);
}
/**
* @method path
* @memberof MC
* @instance
* @param {Array} pathData points of the shape, the points will link together order by the index in the pathData Array 
* @param {boolean} isClose true for close the path, false for not
* @param {json} config config of shape 
* @type path
*/
MC.prototype.path = function(pathData ,isClose ,config){
	return new path(pathData ,isClose ,this ,this.canvas ,this.c ,config);
}
/**
* @method path
* @memberof MC
* @instance
* @param {string} url url of the image 
* @param {double} width width of the image 
* @param {double} height height of the image 
* @param {json} config config of shape
* @type curve 
*/
MC.prototype.img = function(url ,width ,height ,config){
	return new img(url ,width ,height ,this ,this.canvas ,this.c ,config);
}
/**
* @method curve
* @memberof MC
* @instance
* @param {Array} points control points of curve, a pairs for Two Bessel curve, two for Three Bessel curve
* @param {json} config config of shape 
* @type curve
*/
MC.prototype.curve = function(points,config){
	return new curve(points ,this ,this.canvas ,this.c ,config);
}
/**
* @method text
* @memberof MC
* @instance
* @param {string} content the content of the text
* @param {int} font-size of the text
* @param {string} font-family of the text
* @param {string} mode of the text
* @param {string} textAlign of the text
* @param {string} textBaseline of the text
* @param {json} config config of shape 
* @type text
*/
MC.prototype.text = function(content ,fontSize ,fontFamily ,mode ,H ,V ,config){
	return new text(content ,fontSize ,fontFamily ,mode ,H ,V ,this ,this.canvas ,this.c ,config);
}

/**
* @method get2DsByClass
* @memberof MC
* @instance
* @param {string} id of shape you want
* @type twoDimension
*/
MC.prototype.get2DById = function(id){
	return this.ids[id];
}

/**
* @method get2DsByClass
* @memberof MC
* @instance
* @param {string} class of shape you want
* @type Array(twoDimension)
*/
MC.prototype.get2DsByClass = function(classname){
	return this.classes[classname];
}

/**
* @method get2DByName
* @memberof MC
* @instance
* @param {string} name type of shape you want
* @type Array(twoDimension)
*/
MC.prototype.get2DByName = function(name){
	return this[name];
}

/**
* @method width
* @memberof MC
* @instance
* @type int
*/
MC.prototype.width = function(){
	return this.canvas.width();
}

/**
* @method height
* @memberof MC
* @instance
* @type int
*/
MC.prototype.height = function(){
	return this.canvas.height();
}

MC.prototype.delay = function ( time ) {
	var now = new Date().valueOf();
	while(new Date().valueOf() - now < time);
}

HTMLCanvasElement.prototype.addEvent = function(who , what , func){		
	if(who.attachEvent){
		who.attachEvent('on'+what , func);
	}else{
		who.addEventListener(what , func ,false);
	}
}

HTMLCanvasElement.prototype.removeEvent = function(who , what , func){
	if(who.detachEvent){
		who.detachEvent('on'+what , func)
	}else{
		who.removeEventListener(what ,func);
	}
}

MC.prototype.addEvent = function (shapeId ,what ,callback) {
	var time = 0,
		canvas = this.canvas,
		events = this.events[what][shapeId+""] = this.events[what][shapeId+""] || {};

	this.delay(1);
	eval("events.event"+(time = new Date().valueOf())+"=null");
	events["event"+time] = function(e){
		var e = e || event;
		callback(e);
	}
	canvas.addEvent(canvas ,"click" ,events["event"+time] );
}

MC.prototype.removeEvent = function (shapeId ,what) {
	var events = this.events[what][shapeId],
		what = what;

	for(x in events) {
		this.canvas.removeEvent(this.canvas ,what ,events[x]);
	}
};
***********************************************************
***********************************************************
***********************************************************
***********************************************************
***********************************************************
***********************************************************
***********************************************************
***********************************************************
***********************************************************
***********************************************************
***********************************************************
***********************************************************
***********************************************************
***********************************************************
***********************************************************
***********************************************************
***********************************************************
***********************************************************
***********************************************************
***********************************************************
***********************************************************
***********************************************************

***********************************************************
***********************************************************
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
	***********************************************************
	***********************************************************
	***********************************************************
	***********************************************************
	***********************************************************
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
				animator.started = true;			
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
		anis[i].stop();
	}
	this.animator.dequeue();
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

***********************************************************
Math.SIN = function (deg) {
	return Math.sin(deg/360*Math.PI*2);
}
Math.COS = function (deg) {
	return Math.cos(deg/360*Math.PI*2);
}
function polygon (num_of_side ,r ,MC ,canvas , c, config) {
	this.num_of_side = num_of_side;
	this.r = r;

	twoDimension.call(this ,MC ,canvas , c, config);

	this.draw = function (ifRedraw){
		var x = this.offset ? this.offset.x : 0,
			y = this.offset ? this.offset.y : 0,
			num = this.num_of_side,
			c = this.c,
			r = this.r,
			each = 360 / num,
			callbackRedraw = {};

		callbackRedraw.callback = null;
		callbackRedraw.redrawFlag = null;
		this.callbackRedraw(callbackRedraw ,ifRedraw);

		this.drawProcessing(function(){
			c.moveTo(x + Math.COS(0) * r , y + Math.SIN(0) * r);
			for(var i = 1 ; i < num ; i++){
				c.lineTo(x + Math.COS(i * each) * r , y + Math.SIN(i * each) * r);
			}
			c.closePath();
		},callbackRedraw.redrawFlag);

		if(callbackRedraw.callback){
			callbackRedraw.callback.call(this);
		}
		return this;
	}
} 
function rect (width ,height ,MC ,canvas , c, config){
	this.height = height;
	this.width = width;

	twoDimension.call(this ,MC ,canvas , c, config);

	this.draw = function (ifRedraw) {
		var height = this.height,
			width = this.width,
			x = this.offset ? this.offset.x : 0,
			y = this.offset ? this.offset.y : 0,
			c = this.c,
			callbackRedraw = {};

		callbackRedraw.callback = null;
		callbackRedraw.redrawFlag = null;
		this.callbackRedraw(callbackRedraw ,ifRedraw);

		this.drawProcessing(function(){
			c.moveTo(x,y);
			c.lineTo(x+width,y);
			c.lineTo(x+width,y+height);
			c.lineTo(x,y+height);
			c.closePath();
		},callbackRedraw.redrawFlag);

		if(callbackRedraw.callback){
			callbackRedraw.callback.call(this);
		}
		return this;

	}
}
function arc (r ,startAngle ,endAngle ,mode ,MC ,canvas , c, config){
	this.r = r;
	this.startAngle = startAngle,
	this.endAngle = endAngle,
	this.mode = mode;

	twoDimension.call(this ,MC ,canvas , c, config);
}
arc.prototype.draw = function(ifRedraw) {
	var x = this.offset ? this.offset.x : 0,
		y = this.offset ? this.offset.y : 0,
		r = this.r,
		mode = this.mode,
		startAngle = this.startAngle,
		endAngle = this.endAngle,
		c = this.c,
		callbackRedraw = {};

	callbackRedraw.callback = null;
	callbackRedraw.redrawFlag = null;
	this.callbackRedraw(callbackRedraw ,ifRedraw);

	this.drawProcessing(function(){
		c.arc(x,y,r,startAngle,endAngle,mode);
	},callbackRedraw.redrawFlag);

	if(callbackRedraw.callback){
		callbackRedraw.callback.call(this);
	}
	return this;
}

function path (pathData ,isClose ,MC ,canvas , c, config){
	this.pathData = pathData;
	this.isClose = isClose;

	twoDimension.call(this ,MC ,canvas , c, config);

}
path.prototype.draw = function (ifRedraw) {
	var pathData = this.pathData instanceof Array ? this.pathData : this.pathData(),
		dataLength = pathData.length,
		isClose = this.isClose,
		index = 1,
		c = this.c,
		callbackRedraw = {};

	callbackRedraw.callback = null;
	callbackRedraw.redrawFlag = null;
	this.callbackRedraw(callbackRedraw ,ifRedraw);

	this.drawProcessing(function() {
		c.moveTo(pathData[0][0],pathData[0][1]);
		for( ; index < dataLength ; index ++){
			c.lineTo(pathData[index][0],pathData[index][1]);
		}
		if(isClose){
			c.closePath();
		}
	},callbackRedraw.redrawFlag);

	if(callbackRedraw.callback){
		callbackRedraw.callback.call(this);
	}
	return this;
}

function img (url ,width , height, MC ,canvas , c, config){
	this.url = url ;
	this.width = width ;
	this.height = height ;

	twoDimension.call(this ,MC ,canvas , c, config);

}
img.prototype.draw = function (ifRedraw) {
	var url = this.url,
		width = this.width,
		height = this.height,
		exit = function(){
			return false;
		}
		resourse = this.MC.resourse[url] ? 
				   this.MC.resourse[url] :
				   (function(url){
					   	try{
					   		var img = new Image();
					   		img.src = url;
					   		this.MC.resourse[url] = img;
					   		return img;
					   	}catch(e){
					   		console.error("no that file!!!");
					   		exit();
					   	}
				   }).call(this ,url);
		c = this.c,
		x = this.offset ? this.offset.x : 0,
		y = this.offset ? this.offset.y : 0,
		_this = this,
		callback = null,
		callbackRedraw = {};

	callbackRedraw.callback = null;
	callbackRedraw.redrawFlag = null;
	this.callbackRedraw(callbackRedraw ,ifRedraw);

	this.drawProcessing(function(ifRedraw){
		if(_this.url)
			c.drawImage(resourse,x,y,width,height);
	},callbackRedraw.redrawFlag);

	if(callbackRedraw.callback){
		callbackRedraw.callback.call(this);
	}
	return this;
}

function curve (points ,MC ,canvas , c, config){
	if(points.length != 6 && points.length != 8){
		console.error("wrong arguments!!!");
		return false;
	}
	this.points = points ;

	twoDimension.call(this ,MC ,canvas , c, config);

}
curve.prototype.draw = function(ifRedraw) {
	var points = this.points,
		c = this.c,
		x = this.offset ? this.offset.x : 0,
		y = this.offset ? this.offset.y : 0,
		callbackRedraw = {};

	callbackRedraw.callback = null;
	callbackRedraw.redrawFlag = null;
	this.callbackRedraw(callbackRedraw ,ifRedraw);	

	this.drawProcessing(function(){
		c.moveTo(points[0],points[1]);
		if(points.length == 6){
			c.quadraticCurveTo(points[2],points[3],points[4],points[5]);
		}else{
			c.bezierCurveTo(points[2],points[3],points[4],points[5],points[6],points[7]);
		}
	},callbackRedraw.redrawFlag);

	if(callbackRedraw.callback){
		callbackRedraw.callback.call(this);
	}
	return this;
}

function text (string ,fontSize ,fontFamily ,mode  ,H ,V ,MC ,canvas , c, config){
	this.string = string;
	this.fontSize = fontSize;
	this.fontFamily = fontFamily;
	this.mode = mode;
	this.V = V;
	this.H = H;

	twoDimension.call(this ,MC ,canvas , c, config);
}
text.prototype.draw = function(ifRedraw) {
	var string = this.string,
		fontSize = this.fontSize,
		fontFamily = this.fontFamily ? this.fontFamily : "",
		mode = this.mode,
		V = this.V,
		H = this.H,
		x = this.offset ? this.offset.x : 0,
		y = this.offset ? this.offset.y : 0,
		c = this.c,
		callbackRedraw = {};

	callbackRedraw.callback = null;
	callbackRedraw.redrawFlag = null;
	this.callbackRedraw(callbackRedraw ,ifRedraw);

	this.drawProcessing(function(){
		c.textAlign = H;
		c.textBaseline = V;
		c.font = fontSize +"px "+fontFamily;
		c.fillText(string ,x ,y);
	},callbackRedraw.redrawFlag);

	if(callbackRedraw.callback){
		callbackRedraw.callback.call(this);
	}
	return this;
};
***********************************************************
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
function Queue(){
	this.data = [];
}

Queue.prototype = {
	enqueue : function(obj) {
		this.data.push(obj);
	},
	dequeue : function() {
		if(this.isEmpty()){
			return false;
		}
		return this.data.splice(0,1)[0];
	},
	top : function (){
		return this.data[0];
	},
	isEmpty : function () {
		return this.data.length == 0;
	}
}

function Animator(){
	this.aniQueue = new Queue();
	this.timer = null;
	this.started = false;
}

Animator.prototype = {
	dequeue : function(){
		return this.aniQueue.dequeue();
	},
	enqueue : function(obj){
		this.aniQueue.enqueue(obj);
	},
	isEmpty : function(){
		return this.aniQueue.isEmpty();
	}
}

Animator.Fx = function(shape ,options ,attr){
	this.shape = shape;
	this.options = options;
	this.attr = attr;
	this.start = null;
	this.end = null;
	this.startTime = null;
}

Animator.Fx.prototype = {

	begin : function(start ,end){
		this.start = start;
		this.end = end;
		this.startTime = new Date().valueOf();
		Animator.Fx.fxs.push(this);
		Animator.Fx.tick();
	},

	step : function(){
		var t = new Date().valueOf();
		var nowPos;
		if (t > this.startTime + this.options.duration){
			nowPos = this.end;
			this.options.callback.call(this.shape.animator);
			this.stop();
		}else{
			var n = t - this.startTime;
			var state = n / this.options.duration;
			var pct = Animator.Fx.core(state, this.options.aniFunc);
			if(this.start instanceof Array){
				nowPos = [];
				nowPos[0] = this.start[0] + ((this.end[0] - this.start[0]) * pct);
				nowPos[1] = this.start[1] + ((this.end[1] - this.start[1]) * pct);
			}else{
				nowPos = this.start + ((this.end - this.start) * pct);
			}
		}
		this.update(nowPos, this.attr);
	},

	update : function(nowPos ,name){
		var elem = this.shape;
		if(name == "rotate"){
			elem.rotate = nowPos;
		}else{
			elem[name][0] = nowPos[0];
			elem[name][1] = nowPos[1];
		}
		elem.MC.drawAll();
	},

	stop : function(){
		var fxs = Animator.Fx.fxs,
			length = fxs.length
		for ( var i = length - 1; i >= 0; i--){
			if (fxs[i] === this){
				fxs.splice(i, 1);
			}
		}
	}
	
}

Animator.Fx.core = function(state, aniFunc){

	if(aniFunc == "linear"){
		return state;
	}
	if(aniFunc instanceof Array){
		return Animator.Fx.cubicBezier(state ,aniFunc);
	}

}

Animator.Fx.cubicBezier = function(x ,func){
	var p1x = func[0],
		p1y = func[1],
		p2x = func[2],
		p2y = func[3],
		ax = 3 * p1x - 3 * p2x + 1,
		bx = 3 * p2x - 6 * p1x,
		cx = 3 * p1x,
		ay = 3 * p1y - 3 * p2y + 1,
		by = 3 * p2y - 6 * p1y,
		cy = 3 * p1y,
		t ;

	t = Animator.Fx.dichotomyGetT(x ,ax ,bx ,cx ,0 ,1);
	return ((ay * t + by) * t + cy ) * t

}

Number.prototype.equals = function(target){
	return this < target + 0.005 && this > target - 0.005;
}

Number.prototype.lessThan = function(target){
	return this < target - 0.005;
}

Number.prototype.greaterThan = function(target){
	return this > target + 0.005;
}

Animator.Fx.dichotomyGetT = function(x ,ax ,bx ,cx ,leftVal ,rightVal){
	***********************************************************
	var mVal = (leftVal + rightVal)/2,
		lx = Animator.Fx.xTfunc(ax ,bx ,cx ,leftVal);
		rx = Animator.Fx.xTfunc(ax ,bx ,cx ,rightVal);
		mx = Animator.Fx.xTfunc(ax ,bx ,cx ,mVal);
		if(lx.equals(x)){
			return leftVal;
		}
		if(rx.equals(x)){
			return rightVal;
		}
		if(mx.equals(x)){
			return mVal;
		}
		if(mx.greaterThan(x)){
			return arguments.callee(x ,ax ,bx ,cx ,leftVal ,mVal);
		}
		if(mx.lessThan(x)){
			return arguments.callee(x ,ax ,bx ,cx ,mVal ,rightVal);
		}

}

Animator.Fx.xTfunc = function(ax ,bx ,cx ,t){
	return ((ax * t + bx) * t + cx ) * t;
}

Animator.Fx.fxs = [];

Animator.Fx.timer = null;

Animator.Fx.stop = function(){

	clearInterval( Animator.Fx.timer );
	Animator.Fx.timer = null;

};

Animator.Fx.tick = function(){

	if(Animator.Fx.timer){
		return;
	}

	var _this = this;

	timer = setInterval(function(){
		for (var i = 0, c; c = Animator.Fx.fxs[i++];){
			c.step();
		}
		if (!Animator.Fx.fxs.length){
			Animator.Fx.stop();
		}
	}, 10);

};

***********************************************************
