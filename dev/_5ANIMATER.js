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

	stop : function(MC){
		var fxs = Animator.Fx.fxs,
			length = fxs.length,
			anis = MC ? MC.anis : null,
			aniLength = anis ? anis.length : 0;
		for ( var i = length - 1; i >= 0; i--){
			if (fxs[i] === this){
				fxs.splice(i, 1);
				break;
			}
		}
		if(!!aniLength)
			for( var i = aniLength - 1 ; i >=0 ; i --){
				if(anis[i] == this){
					anis.splice(i,1);
					break;
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
	//x = ((ax * t + bx) * t + cx ) * t
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
