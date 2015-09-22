# JSX Templating
Minimal JSX templating. Small footprint, no re-rendering, no diffing. Just templating.

##Warnings
This is not a web application view layer. JSX Templating was implemented to serve a very small use case where templating was desired and the team wanted to see if they could use JSX. File size was of key importance so the feature set is intentionally kept limited.

The biggest feature is that the templating that needed to be done was single pass rendering. Thus, no re-rendering or diffing is included in this library. If you're looking for a good view library React is a vastly superior way to go.