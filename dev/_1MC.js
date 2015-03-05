// _MC.js

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
* @author {@link https://github.com/shaomingquan|shaomingquan} 
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
	//maintain shapes
	/**
	* @memberof MC
	* @instance
	* @type Array(D2)
	* @description collection of D2 shapes in this MC
	*/
	this.shapes = [];

	//maintain typeof shapes
	this.polygons = [];
	this.arcs = [];
	this.paths = [];
	this.imgs = [];
	this.curves = [];
	this.texts = [];

	//maintain these to get by id or class
	this.ids = {};
	this.classes = [];

	//maintain shape detail
	this.events = {};
	this.events.click = {};

	//maintain resourse like image
	this.resourse = {};
	this.resourse.imgs = {};

	//draw enviroment
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