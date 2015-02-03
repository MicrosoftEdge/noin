#NoInline
Command line utility that moves all the inline scripts in an .html file and put them into their own .js files. It then replaces the inline scripts with script tags linking to the newly created .js files. It also goes through and removes all the inline onClick attributes and moves them into their own file.

Put together for csp testing purposes. It's pretty simple code, but was thrown together quickly and not thourougly tested. Use at your own risk.

A few generalized helper/utility functions taken from [Vulcanize](https://github.com/Polymer/vulcanize). [Vulcanize License](http://polymer.github.io/LICENSE.txt).
