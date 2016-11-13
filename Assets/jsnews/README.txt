A Pen created at CodePen.io. You can find this one at http://codepen.io/rrorg/pen/gpxpdR.

 Gets news from reddit's /r/worldnews feed, displays them in an old school matrix look. You can click on the screen to simulate a network error.
Currently working on a wrapper in C# to use Awesomium to render that page to the Desktop background in Windows. In Mac OS, you can use the awesome QDesktop:
https://github.com/qvacua/qdesktop

KNOWN BUGS:
- in some WebKit versions the message box behaves strangely (ignores width/max-width settings). if you know a fix, please let me know!

Please also contact me if you have experience in .NET and have any idea on how to intercept the windows desktop rendering process.