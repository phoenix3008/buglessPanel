Bugless Panel
==================

**Bugless Panel** is a **JavaScript library** used to create **side menu** panels on mobile web sites, 
which can be opened by a swipe on the screen, or by click on a hamburger menu button for example.
It is written on pure JavaScript and doesn't require any third party libraries like jQuery, 
all what you need to do is to connect the JavaScript and CSS file to your project, and to initialize the panel.
As result you will get cool side menu panels, which are **cross browser** and **cross platform**.
Bugless Panel was tested, and it runs perfect on such devices, OS and browsers like:

* iPhone 5s / iPhone 6 / iPad devices with iOS and Safari or Chrome browsers;
* Samsung Galaxy S5;
* Samsung S6 Edge;
* LG Nexus 4;
* And other android devices with Chrome browser.

You can see a [DEMO](http://phoenix3008.github.io/buglessPanel) of this plugin on oficial [Bugless Panle page](http://phoenix3008.github.io/buglessPanel)


There are few examples of using Bugless Panel on a mobile version of popular car auction web site.

[side]: http://phoenix3008.github.io/buglessPanel/img/side-panel-swipe.gif "Side menu panel"
[top]: http://phoenix3008.github.io/buglessPanel/img/top-panel-swipe.gif "Top menu panel"


| Side menu panel | Top menu panel |
|---|---|
| ![side menu panel swipe][side] | ![top menu panel swipe][top] |




## How to use?

To use Bugless Panel you need to:

* Connect JavaScrip and CSS file on your page

```html
<link rel="stylesheet" href="css/bugless-panel.min.css">
<script src="js/bugless-panel.min.js"></script>
```


* Create the base HTML structure of the side pane which includes few required elements

```html
<div class="bugless-panel" id="left-panel">
    <div class="inner">Panel content</div>
</div>
```

* And the last thing that you need to do is to initialize the panel in your JavaScript file

```javascript
var leftPanel = new Panel('#left-panel', {
    position: Panel.POSITION_LEFT
});

BuglessPanels.init({
    content: '.container',
    leftPanel: leftPanel
});
```

By doing these steps you should get a left side panel which can be opened by a right swipe.

## Notes
To make Bugless panel work properly you should separate your page content from panels,
in other words you should have a structure like this:
```html
<!DOCTYPE html>
<html>
	<head>
		<link rel="stylesheet" href="css/bugless-panel.min.css">
	</head>
	<body>
		<div class="container">
			Page content
		</div>

		<div class="bugless-panel" id="left-panel">
			<div class="inner">Panel content</div>
		</div>
		
		<script src="js/bugless-panel.min.js"></script>
	</body>
</html>

```

When we initialize `BuglessPanel` in the example above:
```javascrip
BuglessPanels.init({
    content: '.container',
    leftPanel: leftPanel
});
```
we mean that by swipe on `.container` - the `leftPanel` should br opened.
But you can also open the `leftPanel` by clicking on a button, for this you need to add event listener on button and call `open` method of the panel.
```javascript
document.querySelector('.btn').addEventListener('click', function(e) {
    leftPanel.open();
});
```