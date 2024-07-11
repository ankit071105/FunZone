var svg = document.querySelector("svg");
var cursor = svg.createSVGPoint();
var arrows = document.querySelector(".arrows");
var randomAngle = 0;

var target = {
	x: 900,
	y: 250
};

var lineSegment = {
	x1: 875,
	y1: 280,
	x2: 925,
	y2: 220
};

var pivot = {
	x: 100,
	y: 250
};

var score = 0;
var arrowsShot = 0;

aim({
	clientX: 320,
	clientY: 300
});

window.addEventListener("mousedown", draw);

function draw(e) {
	randomAngle = (Math.random() * Math.PI * 0.03) - 0.015;
	TweenMax.to(".arrow-angle use", 0.3, {
		opacity: 1
	});
	window.addEventListener("mousemove", aim);
	window.addEventListener("mouseup", loose);
	aim(e);
}

function aim(e) {
	var point = getMouseSVG(e);
	point.x = Math.min(point.x, pivot.x - 7);
	point.y = Math.max(point.y, pivot.y + 7);
	var dx = point.x - pivot.x;
	var dy = point.y - pivot.y;
	var angle = Math.atan2(dy, dx) + randomAngle;
	var bowAngle = angle - Math.PI;
	var distance = Math.min(Math.sqrt((dx * dx) + (dy * dy)), 50);
	var scale = Math.min(Math.max(distance / 30, 1), 2);
	TweenMax.to("#bow", 0.3, {
		scaleX: scale,
		rotation: bowAngle + "rad",
		transformOrigin: "right center"
	});
	var arrowX = Math.min(pivot.x - ((1 / scale) * distance), 88);
	TweenMax.to(".arrow-angle", 0.3, {
		rotation: bowAngle + "rad",
		svgOrigin: "100 250"
	});
	TweenMax.to(".arrow-angle use", 0.3, {
		x: -distance
	});
	TweenMax.to("#bow polyline", 0.3, {
		attr: {
			points: "88,200 " + Math.min(pivot.x - ((1 / scale) * distance), 88) + ",250 88,300"
		}
	});

	var radius = distance * 9;
	var offset = {
		x: (Math.cos(bowAngle) * radius),
		y: (Math.sin(bowAngle) * radius)
	};
	var arcWidth = offset.x * 3;

	TweenMax.to("#arc", 0.3, {
		attr: {
			d: "M100,250c" + offset.x + "," + offset.y + "," + (arcWidth - offset.x) + "," + (offset.y + 50) + "," + arcWidth + ",50"
		},
		autoAlpha: distance / 60
	});

}

function loose() {
	window.removeEventListener("mousemove", aim);
	window.removeEventListener("mouseup", loose);

	TweenMax.to("#bow", 0.4, {
		scaleX: 1,
		transformOrigin: "right center",
		ease: Elastic.easeOut
	});
	TweenMax.to("#bow polyline", 0.4, {
		attr: {
			points: "88,200 88,250 88,300"
		},
		ease: Elastic.easeOut
	});

	var newArrow = document.createElementNS("http://www.w3.org/2000/svg", "use");
	newArrow.setAttributeNS('http://www.w3.org/1999/xlink', 'href', "#arrow");
	arrows.appendChild(newArrow);

	var path = MorphSVGPlugin.pathDataToBezier("#arc");
	TweenMax.to([newArrow], 0.5, {
		force3D: true,
		bezier: {
			type: "cubic",
			values: path,
			autoRotate: ["x", "y", "rotation"]
		},
		onUpdate: hitTest,
		onUpdateParams: ["{self}"],
		onComplete: onMiss,
		ease: Linear.easeNone
	});

	TweenMax.to("#arc", 0.3, {
		opacity: 0
	});
	TweenMax.set(".arrow-angle use", {
		opacity: 0
	});

	arrowsShot++;

	// Update score after shooting each arrow
	updateScore();

	// After 5 arrows, show the score and restart option
	if (arrowsShot === 5) {
		TweenMax.delayedCall(3, function () {
			alert("Game Over! Your score is: " + score);
			if (confirm("Do you want to play again?")) {
				restartGame();
			}
		});
	}
}

function hitTest(tween) {
	var arrow = tween.target[0];
	var transform = arrow._gsTransform;
	var radians = transform.rotation * Math.PI / 180;
	var arrowSegment = {
		x1: transform.x,
		y1: transform.y,
		x2: (Math.cos(radians) * 60) + transform.x,
		y2: (Math.sin(radians) * 60) + transform.y
	}

	var intersection = getIntersection(arrowSegment, lineSegment);
	if (intersection.segment1 && intersection.segment2) {
		tween.pause();
		var dx = intersection.x - target.x;
		var dy = intersection.y - target.y;
		var distance = Math.sqrt((dx * dx) + (dy * dy));
		if (distance < 7) {
			score += 5; // Bullseye hit
			showMessage(".bullseye");
			document.getElementById("bullseyeSound").play();
		} else {
			score += 1; // Regular hit
			showMessage(".hit");
			document.getElementById("hitSound").play();
		}
		updateScore();
	}
}

function onMiss() {
	showMessage(".miss");
	document.getElementById("missSound").play();
}

function showMessage(selector) {
	TweenMax.killTweensOf(selector);
	TweenMax.killChildTweensOf(selector);
	TweenMax.set(selector, {
		autoAlpha: 1
	});
	TweenMax.staggerFromTo(selector + " path", .5, {
		rotation: -5,
		scale: 0,
		transformOrigin: "center"
	}, {
		scale: 1,
		ease: Back.easeOut
	}, .05);
	TweenMax.staggerTo(selector + " path", .3, {
		delay: 2,
		rotation: 20,
		scale: 0,
		ease: Back.easeIn
	}, .03);
}

function updateScore() {
	document.getElementById("score").textContent = score;
}

function getMouseSVG(e) {
	cursor.x = e.clientX;
	cursor.y = e.clientY;
	return cursor.matrixTransform(svg.getScreenCTM().inverse());
}

function getIntersection(segment1, segment2) {
	var dx1 = segment1.x2 - segment1.x1;
	var dy1 = segment1.y2 - segment1.y1;
	var dx2 = segment2.x2 - segment2.x1;
	var dy2 = segment2.y2 - segment2.y1;
	var cx = segment1.x1 - segment2.x1;
	var cy = segment1.y1 - segment2.y1;
	var denominator = dy2 * dx1 - dx2 * dy1;
	if (denominator == 0) {
		return null;
	}
	var ua = (dx2 * cy - dy2 * cx) / denominator;
	var ub = (dx1 * cy - dy1 * cx) / denominator;
	return {
		x: segment1.x1 + ua * dx1,
		y: segment1.y1 + ua * dy1,
		segment1: ua >= 0 && ua <= 1,
		segment2: ub >= 0 && ub <= 1
	};
}

function restartGame() {
	score = 0;
	arrowsShot = 0;
	arrows.innerHTML = "";
	TweenMax.set([".bullseye", ".hit", ".miss"], {
		autoAlpha: 0
	});
	updateScore();
}

// Play background music when the page loads
window.addEventListener("load", function() {
	document.getElementById("backgroundMusic").play();
});
