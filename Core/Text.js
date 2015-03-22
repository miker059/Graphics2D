Text = new Class(Shape, {

	init : function(){
		// text, [font], x, y, [fill], [stroke]
		var props = this._text;
		if(isHash( props )){
			this._text  = props.text;
			this._x     = props.x;
			this._y     = props.y;
			this._font  = this._parseFont(props.font || Text.defaultFont);
			if(props.baseline !== undefined)
				this._style.textBaseline = props.baseline;
			if(props.align !== undefined)
				this._style.textAlign = props.align;
			this._genFont();
			this._width = props.width;
			this._parseHash(props);
		}
		else {
			if( !isNumber(this._y) ){ // font isn't exist
				this._stroke = this._fill;
				this._fill = this._y;
				this._y = this._x;
				this._x = this._font;
				this._font = Text.defaultFont;
			}
			this._font = this._parseFont(this._font);
			this._genFont();
			this._processStyle();
		}

		this._style.textBaseline = 'top';
	},

	// параметры
	text : function(t){
		return this._property('text', t);
	},
	x : function(x){
		return this._property('x', x);
	},
	y : function(y){
		return this._property('y', y);
	},
	font : function(font){
		if(font === true)
			return this._style.font;
		if(font === undefined)
			return this._font;
		extend(this._font, this._parseFont(font));
		return this._genFont();
	},
	_setFont : function(name, value){
		if(value === undefined)
			return this._font[name];
		this._font[name] = value;
		return this._genFont();
	},
	_genFont : function(){
		var str = '',
			font = this._font;
		font.italic && (str += 'italic ');
		font.bold && (str += 'bold ');
		return this._setstyle('font', str + (font.size || 10) + 'px ' + (font.family || 'sans-serif'));
		// font.size can't be 0? unexpected behavior
	},
	_parseFont : function(font){
		if(isHash(font)){
			font.size = _.distance(font.size);
			return font;
		}

		var obj = {family:''};
		font.split(' ').forEach(function(val){
			if(val === 'bold')
				obj.bold = true;
			else if(val === 'italic')
				obj.italic = true;
			else if(/^\d+(px|pt)?/.test(val))
				obj.size = _.distance(val);
			else
				obj.family += ' ' + val;
		});
		if( (obj.family = obj.family.replace(/^\s*/, '').replace(/\s*$/, '')) === '' )
			delete obj.family;
		return obj;
	},
	family : function(f){
		return this._setFont('family', f);
	},
	size : function(s){
		return this._setFont('size', s === undefined ? undefined : _.distance(s));
	},
	bold : function(b){
		return this._setFont('bold', b === undefined ? undefined : !!b) || false;
	},
	italic : function(i){
		return this._setFont('italic', i === undefined ? undefined : !!i) || false;
	},
	align : function(a){
		return this._setstyle('textAlign', a);
	},
	baseline : function(b){
		return this._setstyle('textBaseline', b);
	},
	underline : function(val){
		if(val === undefined)
			return !!this._underline;
		return this._property('underline', !!val);
	},
	width : function(w){
		if(w === undefined && this._width === undefined){
			var ctx = this.context.context;
			this._applyStyle();
			var m = ctx.measureText( this._text ).width;
			ctx.restore();
			return m;
		}
		return this._property('width', w);
	},

	// text.font('2px')

	// text.family('Arial');
	// text.size(10);
	// text.weight(true)
	// text.baseline(0)

	isPointIn : function(x, y){
		var b = this.bounds();
		return x > b.x && y > b.y && x < b.x+b.w && y < b.y+b.h;
	},
	_bounds : function(){
		var align = this._style.textAlign || 'left',
			baseline = this._style.textBaseline || 'top',
			width = this.width(),
			size = parseInt(this._font.size) * 1.15, //magic number (from LibCanvas? :))
			x = this._x,
			y = this._y;

		if(align === 'center')
			x -= width/2;
		else if(align === 'right')
			x -= width;

		if(baseline === 'middle')
			y -= size/2;
		else if(baseline === 'bottom' || baseline === 'ideographic')
			y -= size;
		else if(baseline === 'alphabetic')
			y -= size * 0.8;
		return new Bounds(x, y, width, size);
	},
	draw : function(ctx){
		if(!this._visible)
			return;
		this._applyStyle();
		var params = [this._text, this._x, this._y];
		if(this._width)
			params.push(this.width());
		if(this._style.fillStyle)
			ctx.fillText.apply(ctx, params);
		if(this._style.strokeStyle)
			ctx.strokeText.apply(ctx, params);

		// underline
		if(this._underline){
			var b = this.bounds(),
				height = Math.round(this._font.size / 5);
			ctx.beginPath();
			ctx.moveTo(b.x, b.y + b.h - height);
			ctx.lineTo(b.x + b.w, b.y + b.h - height);
			ctx.strokeStyle = this._style.strokeStyle || this._style.fillStyle;
			ctx.lineWidth   = Math.round(this._font.size / 15);
			ctx.stroke();
		}
		ctx.restore();
	}
// TODO: mozPathText; mozTextAlongPath
// https://developer.mozilla.org/en-US/docs/Drawing_text_using_a_canvas
});

Text.props = [ 'text', 'font', 'x', 'y', 'fill', 'stroke' ];
Text.defaultFont = '10px sans-serif';