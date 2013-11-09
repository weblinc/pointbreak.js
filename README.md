pointbreak.js
=============

PointBreak provides a friendly interface to matchMedia with named media queries and easy to create callbacks

Requirements
---
Browsers with window.matchMedia support or equivalent polyfill to evaluate media queries and trigger listener callbacks

Example
---

###Create a point
```
<script type="text/javascript">
	PointBreak.set("small", "(min-width: 320px) and (max-width: 479px)");
</script>
```


###Retrieve a point by name
```
<script type="text/javascript">
	PointBreak.get("small");
</script>
```

###now: Get and set a callback on a named point for immediate evaluation
```
<script type="text/javascript">
	PointBreak
		.get("small")
		.now('match', function(point) {
			// Called immediately if match is true
			//console.log('now match', point);
		});
</script>
```

```
<script type="text/javascript">
	PointBreak
		.get("small")
		.now('unmatch', function(point) {
			// Called immediately if match is false
			//console.log('now unmatch', point);
		});
</script>
```

###once: Get and set a callback on a named point triggering the callback once on match
```
<script type="text/javascript">
	PointBreak
		.get("small")
		.once('match', function(point) {
			// Called once if match is true
			//console.log('once match', point);
		});
</script>
```


```
<script type="text/javascript">
	PointBreak
		.get("small")
		.once('unmatch', function(point) {
			// Called once if match is false
			//console.log('once unmatch', point);
		});
</script>
```


###on: Get and set a callback on a named point triggering the callback each time a match occurs
```
<script type="text/javascript">
	PointBreak
		.set("small")
		.on('match', function(point) {
			// Called each time match is true
			//console.log('match', point);
		});
</script>
```

```
<script type="text/javascript">
	PointBreak
		.get("small")
		.on('unmatch', function(point) {
			// Called each time match is false
			//console.log('unmatch', point);
		});
</script>
```

###Chaining in pointbreak.js
```
<script type="text/javascript">
	PointBreak
		.set("small", "(min-width: 320px) and (max-width: 479px)")
		.now('match', function(point) { //... })
		.once('match', function(point) { //... })
		.on('match', function(point) { //... })
</script>
```
