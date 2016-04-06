function Cubic() {

	var svg=document.documentElement /*svg object*/
	var S=new Array() /*splines*/
	var P=new Array() /*control points*/
	var I=new Array() /*intersection points*/
	var O 	/*current object*/
	var x0,y0	/*svg offset*/



	/*computes spline control points*/

	this.calcIntersectionAt = function (perc){

		P[0] = {x:60,y:400};
		P[1] = {x:100,y:80};
		P[2] = {x:600,y:80};
		P[3] = {x:700,y:400};

		P[4] = {x:P[0].x + (P[3].x - P[0].x)*perc,y:50};
		P[5] = {x:P[0].x + (P[3].x - P[0].x)*perc,y:400};

		if (!perc) return 0;
		else if (perc == 1.0) return 0;

	    var y = computeIntersections2([P[0].x,P[1].x,P[2].x,P[3].x],[P[0].y,P[1].y,P[2].y,P[3].y],[P[4].x,P[5].x],[P[4].y,P[5].y]);

        return (1.0 - ((y - 160)/(400-160)));



	}
	function computeIntersections2(px,py,lx,ly)
	{
	    var X=Array();

	    var A=ly[1]-ly[0];	    //A=y2-y1
		var B=lx[0]-lx[1];	    //B=x1-x2
		var C=lx[0]*(ly[0]-ly[1]) +
		  ly[0]*(lx[1]-lx[0]);	//C=x1*(y1-y2)+y1*(x2-x1)

		var bx = bezierCoeffs(px[0],px[1],px[2],px[3]);
		var by = bezierCoeffs(py[0],py[1],py[2],py[3]);

	    var P = Array();
		P[0] = A*bx[0]+B*by[0];		/*t^3*/
		P[1] = A*bx[1]+B*by[1];		/*t^2*/
		P[2] = A*bx[2]+B*by[2];		/*t*/
		P[3] = A*bx[3]+B*by[3] + C;	/*1*/

		var r=cubicRoots(P);

	    /*verify the roots are in bounds of the linear segment*/
	    for (var i=0;i<3;i++)
	    {
		t=r[i];

		X[0]=bx[0]*t*t*t+bx[1]*t*t+bx[2]*t+bx[3];
		X[1]=by[0]*t*t*t+by[1]*t*t+by[2]*t+by[3];

		/*above is intersection point assuming infinitely long line segment,
		  make sure we are also in bounds of the line*/
		var s;
		if ((lx[1]-lx[0])!=0)           /*if not vertical line*/
		    s=(X[0]-lx[0])/(lx[1]-lx[0]);
		else
		    s=(X[1]-ly[0])/(ly[1]-ly[0]);

		/*in bounds?*/
		if (t<0 || t>1.0 || s<0 || s>1.0)
		{
		    X[0]=-100;  /*move off screen*/
		    X[1]=-100;
		}

		/*move intersection point*/
		return X[1];
		I[i].setAttributeNS(null,"cx",X[0]);
		I[i].setAttributeNS(null,"cy",X[1]);
	    }

	}


	/*computes intersection between a cubic spline and a line segment*/
	function computeIntersections(px,py,lx,ly)
	{
	    var X=Array();

	    var A=ly[1]-ly[0];	    //A=y2-y1
		var B=lx[0]-lx[1];	    //B=x1-x2
		var C=lx[0]*(ly[0]-ly[1]) +
		  ly[0]*(lx[1]-lx[0]);	//C=x1*(y1-y2)+y1*(x2-x1)

		var bx = bezierCoeffs(px[0],px[1],px[2],px[3]);
		var by = bezierCoeffs(py[0],py[1],py[2],py[3]);

	    var P = Array();
		P[0] = A*bx[0]+B*by[0];		/*t^3*/
		P[1] = A*bx[1]+B*by[1];		/*t^2*/
		P[2] = A*bx[2]+B*by[2];		/*t*/
		P[3] = A*bx[3]+B*by[3] + C;	/*1*/

		var r=cubicRoots(P);

	    /*verify the roots are in bounds of the linear segment*/
	    for (var i=0;i<3;i++)
	    {
		t=r[i];

		X[0]=bx[0]*t*t*t+bx[1]*t*t+bx[2]*t+bx[3];
		X[1]=by[0]*t*t*t+by[1]*t*t+by[2]*t+by[3];

		/*above is intersection point assuming infinitely long line segment,
		  make sure we are also in bounds of the line*/
		var s;
		if ((lx[1]-lx[0])!=0)           /*if not vertical line*/
		    s=(X[0]-lx[0])/(lx[1]-lx[0]);
		else
		    s=(X[1]-ly[0])/(ly[1]-ly[0]);

		/*in bounds?*/
		if (t<0 || t>1.0 || s<0 || s>1.0)
		{
		    X[0]=-100;  /*move off screen*/
		    X[1]=-100;
		}

		/*move intersection point*/
		I[i].setAttributeNS(null,"cx",X[0]);
		I[i].setAttributeNS(null,"cy",X[1]);
	    }

	}

	/*based on http://mysite.verizon.net/res148h4j/javascript/script_exact_cubic.html#the%20source%20code*/
	function cubicRoots(P)
	{
		var a=P[0];
		var b=P[1];
		var c=P[2];
		var d=P[3];

		var A=b/a;
		var B=c/a;
		var C=d/a;

	    var Q, R, D, S, T, Im;

	    var Q = (3*B - Math.pow(A, 2))/9;
	    var R = (9*A*B - 27*C - 2*Math.pow(A, 3))/54;
	    var D = Math.pow(Q, 3) + Math.pow(R, 2);    // polynomial discriminant

	    var t=Array();

	    if (D >= 0)                                 // complex or duplicate roots
	    {
		var S = sgn(R + Math.sqrt(D))*Math.pow(Math.abs(R + Math.sqrt(D)),(1/3));
		var T = sgn(R - Math.sqrt(D))*Math.pow(Math.abs(R - Math.sqrt(D)),(1/3));

		t[0] = -A/3 + (S + T);                    // real root
		t[1] = -A/3 - (S + T)/2;                  // real part of complex root
		t[2] = -A/3 - (S + T)/2;                  // real part of complex root
		Im = Math.abs(Math.sqrt(3)*(S - T)/2);    // complex part of root pair

		/*discard complex roots*/
		if (Im!=0)
		{
		    t[1]=-1;
		    t[2]=-1;
		}

	    }
	    else                                          // distinct real roots
	    {
		var th = Math.acos(R/Math.sqrt(-Math.pow(Q, 3)));

		t[0] = 2*Math.sqrt(-Q)*Math.cos(th/3) - A/3;
		t[1] = 2*Math.sqrt(-Q)*Math.cos((th + 2*Math.PI)/3) - A/3;
		t[2] = 2*Math.sqrt(-Q)*Math.cos((th + 4*Math.PI)/3) - A/3;
		Im = 0.0;
	    }

	    /*discard out of spec roots*/
		for (var i=0;i<3;i++)
		if (t[i]<0 || t[i]>1.0) t[i]=-1;

		/*sort but place -1 at the end*/
	    t=sortSpecial(t);

		//console.log(t[0]+" "+t[1]+" "+t[2]);
	    return t;
	}

	function sortSpecial(a)
	{
	    var flip;
	    var temp;

	    do {
		flip=false;
		for (var i=0;i<a.length-1;i++)
		{
		    if ((a[i+1]>=0 && a[i]>a[i+1]) ||
			(a[i]<0 && a[i+1]>=0))
		    {
			flip=true;
			temp=a[i];
			a[i]=a[i+1];
			a[i+1]=temp;

		    }
		}
	    } while (flip);
		return a;
	}

	// sign of number
	function sgn( x )
	{
	    if (x < 0.0) return -1;
	    return 1;
	}

	function bezierCoeffs(P0,P1,P2,P3)
	{
		var Z = Array();
		Z[0] = -P0 + 3*P1 + -3*P2 + P3;
	    Z[1] = 3*P0 - 6*P1 + 3*P2;
	    Z[2] = -3*P0 + 3*P1;
	    Z[3] = P0;
		return Z;
	}

	/*creates formated path string for SVG cubic path element*/
	function pathCubic(x,y)
	{
		return "M "+x[0]+" "+y[0]+" C "+x[1]+" "+y[1]+" "+x[2]+" "+y[2]+" "+x[3]+" "+y[3];
	}

	/*creates formated path string for SVG cubic path element*/
	function pathLine(x,y)
	{
		return "M "+x[0]+" "+y[0]+" L "+x[1]+" "+y[1];
	}

	/*code from http://stackoverflow.com/questions/442404/dynamically-retrieve-html-element-x-y-position-with-javascript*/
	function getOffset( el )
	{
	    var _x = 0;
	    var _y = 0;
	    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
		_x += el.offsetLeft - el.scrollLeft;
		_y += el.offsetTop - el.scrollTop;
		el = el.offsetParent;
	    }
	    return { top: _y, left: _x };
	}
}

Cubic.prototype.doit = function (t) {
    document.getElementById("input").value = t.value;
    document.getElementById("output").value = this.calcIntersectionAt(t.value/100.0);


}

CUB = new Cubic();
