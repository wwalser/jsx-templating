JSX Templating
==============
[![Build Status](https://travis-ci.org/wwalser/jsx-templating.svg?branch=master)](https://travis-ci.org/wwalser/jsx-templating) [![NPM Version](http://img.shields.io/npm/v/jsx-templating.svg)](https://www.npmjs.com/package/jsx-templating)
Minimal JSX templating. Small footprint, no re-rendering, no diffing. Just templating.

Designed for an embedded script where single pass templating was needed and JSX syntax was desired. Limited use case, but serves well as a micro templating library.

## Warnings
This is not a web application view layer. JSX Templating was implemented to serve a very small use case where templating was desired and the team wanted to see if they could use JSX. File size was of key importance so the feature set is intentionally kept limited.

The only feature needed was single pass rendering. Thus, no re-rendering or diffing is included in this library. If you're looking for a good view library [React](http://facebook.github.io/react/) is a vastly superior option. Many other templating libraries, such as [Handlebars](http://handlebarsjs.com/), are more fully featured (but are larger in file size).