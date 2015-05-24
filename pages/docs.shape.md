Shape
===================

Abstract class for shapes (all drawing objects inherits it).

You can create any object in two ways:
	// parameters
	ctx.rect(10, 10, 200, 200, 'black', '2px blue');

	// or object
	ctx.rect({
	    x: 10,
	    y: 10,
	    width: 200,
	    height: 200,
	    fill: 'black',
	    stroke: '2px blue',
	    opacity: 0.5 // additional property
	});

Available properties: `opacity`, `composite`, `visible`, `clip`.

Btw, you can create hidden objects - they will respond to events.

And you can use css units:
	ctx.rect('10pt', '10pt', '0.5em', '1em');

#### fill
Filling of the object:
	rect.fill('red');
	rect.fill(); // -> 'red'

Object with `colors` property is gradient.
	rect.fill({ colors:['red', 'green'], from:'top', to:'bottom' });
	rect.fill().from(); // -> 'top'

Image, object with `image` property, string starts from `http://`, `https://`, `./`, `../`, `data:image/`, `<svg` - is pattern.
	rect.fill('./image.jpg');

#### stroke
Object stroke:
	rect.stroke(); // -> { fill : 'black', width : 2 }
	rect.stroke({ fill:'red' });
	rect.stroke('black 4pt');
**Note: width - always in pixels.**

Available parameters:
 - `width` -- `2px`, `0.5em`, `8`...
 - `color` -- `#f00`, `green`, `rgb(0, 0, 0)`...
 - `join` -- `miter` / `bevel` / `round`.
 - `cap` -- `butt` / `square` / `round`.
 - `dash` -- `[1,2,2]`, `shortdash`, `shortdot`, `shortdashdot`, `shortdashdotdot`, `dot`, `dash`, `longdash`, `dashdot`, `longdashdot`, `longdashdotdot`.
 - opacity -- only in string; example: `green 0.5` instead of `rgba(0, 128, 0, 0.5)`.

	rect.stroke('0.5em round square [1,2] green 0.5');

Removing stroke:
	rect.stroke(null);

#### opacity
Opacity (float from 0 to 1).

#### composite
Blend mode.

Standart: `source-over`, `source-atop`, `source-in`, `source-out`, `destination-over`, `destination-atop`, `destination-in`, `destination-out`, `lighter`, `darker`, `copy`, `xor`.

In some browsers can be using: `normal`, `multiply`, `screen`, `overlay`, `darken`, `lighten`, `color-dodge`, `color-burn`, `hard-light`, `soft-light`, `difference`, `exclusion`, `hue`, `saturation`, `color`, `luminosity`.

W3C: http://dev.w3.org/fxtf/compositing-1
MDN: http://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Compositing

#### hide, show
Makes the object hidden / visible.

#### cursor
Sets a cursor to object:
	rect.cursor('pointer');

#### z
Z-index.

In Graphics2D z-index -- is the element index in context elements collection. Each element has his unique z-index; objects with larger z-index will be drawn over objects with less z-index.
	var a = ctx.rect(10, 10, 200, 200);
	var b = ctx.circle(100, 100, 50);
	a.z(); // -> 0
	b.z(); // -> 1

	b.z(0);
	b.z(); // -> 0
	a.z(); // -> 1

You can also use `top` value:
	rect.z('top');

#### isPointIn(x, y)
Returns `true` if point *(x, y)* is in the shape.

#### clip(object)
Adds clip.
	var rect = ctx.rect(10, 10, 100, 100, 'red'),
		circle = ctx.circle(10, 10, 50);

	rect.clip(circle);
	rect.clip(); // -> circle

Removing clip:
	rect.clip(null);

And:
	// clipping by rect
	object.clip(x, y, width, height);

	// clipping by circle
	object.clip(cx, cy, radius);

	// clipping by path
	object.clip([[10, 10], [100, 100], [100,10], true]);

	// clipping by custom path
	object.clip({
		processPath : function(ctx){
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(100, 0);
			ctx.lineTo(50, 100);
			ctx.closePath();
		}
	});

You can change the clip:
	object.clip(100, 100, 100, 100);
	object.clip().animate('rotate', 45);

#### mouse(state)
Switches on / off mouse events on element.
	rect.mouse(false);

#### clone(instance, events)
Clones object.

Instance = true: don't clone the style (any style changing will change the clone too). 
Events = true: don't clone the events.

	var r = ctx.rect(10, 10, 50, 50, 'red');
	var g = r.clone();
	var b = r.clone(true); // b is an instance

	g.fill('green'); // r and b still is red
	b.fill('blue'); // then r is blue too

#### shadow(style)
With object:
	element.shadow({
		x: 0, y: 5, blur: 5, color:'gray'
	});
**Note: you can use `opacity` property.**

One parameter:
	element.shadow('x', '10px');
	element.shadow('x'); // -> 10

CSS-style:
	element.shadow('1px 1px 2px red');

Removing:
	element.shadow(null);

#### corner(corner, options)
Returns coords of the corner on object bounds.
	element.corner('top right');

Options: transform (true / false), stroke (true / false).
	element.corner('center', {
		transform: true,
		stroke: false
	})

Also:
	element.corner({ from:'bottom left', x:10, y:10 });

#### bounds(options)
Returns bound box of the object.
`points` at options:
	object.bounds('points'); // -> { lt:[x, y], rt, lb, rb }
	// lt = left top, rb = right bottom

Or options is object with transform (true / false) and stroke (true / false / `exclude`).
	var b = object.bounds();
	var b = object.bounds({ transform: true, stroke: 'exclude' })

#### remove()
Removes the object.

#### on(event, callback)