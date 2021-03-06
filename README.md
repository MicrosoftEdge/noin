# Noin
[![Build Status](https://travis-ci.org/alxlu/noin.svg?branch=master)](https://travis-ci.org/alxlu/noin)

Command line utility that moves all the inline scripts in an .html file and put them into their own .js files. It then replaces the inline scripts with script tags linking to the newly created .js files. It also goes through and removes all inline event listeners and moves them into their own file.

## Installation
To install, just run:
```bash
npm install -g noin
```

## Usage
To use noin on an individual file simply run:
```bash
noin index.html
```
To use noin on an entire folder add the -r flag:
```bash
noin -r directory
```

## Example
Noin will take in an HTML file:

*index.html*
```html
<html>
<head>
  <script>
  console.log('This inline script is in the header');
  </script>
</head>
<body>
  <p onClick="console.log('This is an inline event');">p Element</p>
  <div onClick='console.log("Different quotation marks");'>div Element</div>
  <div onClick="alert('This div has already has an ID');" id="named">Another div ELement</div>
  <p onclick="alert('Testing lowercase onclick');">Another p Element</p>
  <script>
  console.log("This inline script is in the footer");
  </script>
</body>
</html>
```
It backs up the file (index.html.old), then it generates individual .js files for each inline script and inline event listener

*index_script0.js*
```javascript
console.log('This inline script is in the header');
```
*index_script1.js*
```javascript
console.log('This inline script is in the footer');
```
*index_events.js*
```javascript
var listener_0 = document.getElementById("listener_0");
listener_0.addEventListener("click", function() {console.log('This is an inline event');}, false);
var listener_1 = document.getElementById("listener_1");
listener_1.addEventListener("click", function() {console.log("Different quotation marks");}, false);
var named = document.getElementById("named");
named.addEventListener("click", function() {alert('This div has already has an ID');}, false);
var listener_2 = document.getElementById("listener_2");
listener_2.addEventListener("click", function() {alert('Testing lowercase onclick');}, false);
```
And rips out all the inline script and inline events and links them properly to the .js file (it will add id's to elements that have inline events but no id).

*index.html*
```html
<html>
<head>
  <script src="index_script0.js"></script>
</head>
<body>
  <p id="listener_0">p Element</p>
  <div id="listener_1">div Element</div>
  <div id="named">Another div ELement</div>
  <p id="listener_2">Another p Element</p>
  <script src="index_script1.js"></script>
  <script src="index_events.js"></script>
</body>
</html>
```

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
