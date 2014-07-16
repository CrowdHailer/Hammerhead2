Hammerhead 2
============

[ ![Codeship Status for CrowdHailer/Hammerhead2](https://www.codeship.io/projects/d312c9d0-cc53-0131-b833-02443375fc0a/status?branch=master)](https://www.codeship.io/projects/22673)

[![Code Climate](https://codeclimate.com/github/CrowdHailer/Hammerhead2.png)](https://codeclimate.com/github/CrowdHailer/Hammerhead2)

##### A library to manage navigation over large SVG elements
This library manipulates and individual svg element on click, touch and mousewheel input. It tries to sensibly utilise hardware accelerated transforms during transition. To gain full benifit of using vector graphics transformations are finalised without hardware accelerated transformations

### Support

Eventually Anything with full SVG support.

works on all desktop browsers with SVG.
Currently not working on iOS or windows phone browser.

### Installation

Hammerhead2 is available on bower. To install run

```
  $ bower install hammerhead2 --save
```

### Dependencies 

This requires the external libraries [hammerjs](http://eightmedia.github.io/hammer.js/) and [zepto](http://zeptojs.com/).

These dependancies will have be downloaded by bower but need separatly including in you page

The library also relies on the following

1. [cumin](https://github.com/CrowdHailer/cuminjs) - for expanded utilities such as reduce, compose, pick
2. [belfry](https://github.com/CrowdHailer?tab=repositories) - minimal publish/subscribe library
3. [SoVeryGroovy](https://github.com/CrowdHailer/SoVeryGroovy) - Library to generate svg elements

These dependancies will have been downloaded by bower and are automatically included if you use the code in the fullfat directory instead of the dist directory.

### Use

Add the following script tags to your page.

```html
<script type="text/javascript" src="path/to/zepto.js"></script>
<script type="text/javascript" src="path/to/hammer.min.js"></script>
<script type="text/javascript" src="path/to/fullfat/HammerHead2.min.js"></script>
```

The distribution also includes a sensible stylesheet optimised for showing full screen maps. include that in the document header

```html
<link rel="stylesheet" href="path/to/hammerhead2.css">
```

The active graphic is initialised from the elements id and an options argument

```js
var active = Hammerhead2.create(<element-id>, <options>)
```

### Options

The available options and defaults are

- overflowSurplus: 0.8
- resizeDelay: 200
- maxZoom: 4
- minZoom: 1
- mousewheelSensitivity: 0.2
- mousewheelDelay: 100

### Implementation
To allow for smooth dragging and zooming the element is first transformed using css transform. This moves the rendered pixel map of the area inside the current viewbox only. This can be done using hardware acceleration. The matrix transform to be applied is made available to a render loop called on request animation frame. 

Using css transformations means that when zooming in the image will pixelate. To correct for this when the transformation is deamed to have ended (different for each interaction, see below) the css transformation is removed and the imaged moved by correspodingly changing the viewbox. This is a slow step dependant on the number of elements in the image. This is done to create a new image at full resolution at any magnification.

##### touch
A touchstart event publishes a start event. drag and pich events are published throught the gesture and an end event is triggered on a touch end

##### mouse
A mousedown publishes a start event, dragging is published and a mouse up event causes a end event to be published

##### mousewheel
the first scroll publishes a start event subsequent scrolls fire zoom events and an event event is published after an appropriate timeout.

### Contributing
**NB.** This functionality has so far been very difficult to implement taking into consideration all the various browser options. As always it is good practise to add tests but the existing test coverage cannot offer complete confidence that the code is working on all browsers. This is worth bearing in mind when editing the code as it is worth checking on as many devices as possible.

