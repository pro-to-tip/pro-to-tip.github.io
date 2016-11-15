A Pen created at CodePen.io. You can find this one at http://codepen.io/nw/pen/yeyPGY.

 DailyUI #022 - Search.

A search system for quickly getting answers or info on a topic. Results are all from the extremely useful [DuckDuckGo Instant Answers API](https://duckduckgo.com/api)

Try entering things like the name of a fictional character, TV show, places, companies, etc.

Using a slightly modified version of https://github.com/sobstel/jsonp.js for the JSONP/cross-domain results fetching.

The loading animation on the search icon is using svg `stroke-dasharray` to create the spinner. (ddg is pretty quick, so enter a blank search query to force a timeout to see the spinner spinning (it's not anything too exciting)).