// _SHAPE.js
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