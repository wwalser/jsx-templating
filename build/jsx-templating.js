(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jsxTemplating = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _require=="function"&&_require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof _require=="function"&&_require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_require,module,exports){
'use strict';

var element = _require('virtual-element');
var defaults = _require('object-defaults');
//var keypath = require('object-path');

function render(node) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(toNative(node));
    return fragment;
}
module.exports = {
    render: render,
    element: element
};

/**
 * Renders a component tree.
 * Returns a document fragment containing the full tree.
 */
function toNative(node) {
    switch (nodeType(node)) {
        case "text":
            return renderTextNode(node);
        case "element":
            return renderElement(node);
        case "component":
            return renderComponent(node);
    }
}

function nodeType(node) {
    var type = valType(node);
    if (type === 'null' || node === false) return 'empty';
    if (type !== 'object') {
        return 'text';
    }
    if (valType(node.type) === 'string') {
        return 'element';
    }
    return 'component';
}

function valType(val) {
    if (val === null) {
        return 'null';
    };
    if (val === undefined) {
        return 'undefined';
    };

    val = val.valueOf ? val.valueOf() : Object.prototype.valueOf.apply(val);

    return typeof val;
}

function setAttribute(element, name, value) {
    switch (name) {
        case 'checked':
        case 'disabled':
        case 'selected':
            element[name] = true;
            break;
        case 'innerHTML':
            element.innerHTML = value;
            break;
        case 'value':
            element.value = value;
            break;
        default:
            element.setAttribute(name, value);
            break;
    }
}

function normalizeComponent(componentNode) {
    var component = componentNode.type;
    var props = {
        children: componentNode.children
    };
    Object.keys(componentNode.attributes).forEach(function (attribute) {
        props[attribute] = componentNode.attributes[attribute];
    });
    return {
        component: component,
        render: typeof component === 'function' ? component : component.render,
        props: defaults(props || {}, componentNode.defaultProps || {}),
        state: componentNode.initialState ? componentNode.initialState(props) : {},
        displayName: componentNode.name || 'Component'
    };
}

function renderTextNode(textNode) {
    return document.createTextNode(textNode);
}

function renderElement(elementNode) {
    var tagName = elementNode.type;
    var attributes = elementNode.attributes;
    var childNodes = elementNode.children;

    var element = document.createElement(tagName);

    Object.keys(attributes).forEach(function (attributeName) {
        setAttribute(element, attributeName, attributes[attributeName]);
    });

    childNodes.forEach(function (child) {
        var childNode = toNative(child);
        element.appendChild(childNode);
    });

    return element;
}

function renderComponent(componentNode) {
    var component = normalizeComponent(componentNode);
    var fn = component.render;
    if (!fn) throw new Error('Component needs a render function');
    var node = fn(component.props);
    if (!node) throw new Error('Render function must return an element.');
    return toNative(node);
}

},{"object-defaults":2,"virtual-element":3}],2:[function(_require,module,exports){
'use strict'

module.exports = function(target) {
  target = target || {}

  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i]
    if (!source) continue

    Object.getOwnPropertyNames(source).forEach(function(key) {
      if (undefined === target[key])
        target[key] = source[key]
    })
  }

  return target
}

},{}],3:[function(_require,module,exports){
/**
 * Module dependencies.
 */

var slice = _require('sliced')
var flatten = _require('array-flatten')

/**
 * This function lets us create virtual nodes using a simple
 * syntax. It is compatible with JSX transforms so you can use
 * JSX to write nodes that will compile to this function.
 *
 * let node = element('div', { id: 'foo' }, [
 *   element('a', { href: 'http://google.com' }, 'Google')
 * ])
 *
 * You can leave out the attributes or the children if either
 * of them aren't needed and it will figure out what you're
 * trying to do.
 */

module.exports = element

/**
 * Create virtual trees of components.
 *
 * This creates the nicer API for the user.
 * It translates that friendly API into an actual tree of nodes.
 *
 * @param {*} type
 * @param {Object} attributes
 * @param {Array} children
 * @return {Object}
 * @api public
 */

function element (type, attributes, children) {
  // Default to div with no args
  if (!type) {
    throw new TypeError('element() needs a type.')
  }

  // Skipped adding attributes and we're passing
  // in children instead.
  if (arguments.length === 2 && (typeof attributes === 'string' || Array.isArray(attributes))) {
    children = [ attributes ]
    attributes = {}
  }

  // Account for JSX putting the children as multiple arguments.
  // This is essentially just the ES6 rest param
  if (arguments.length > 2) {
    children = slice(arguments, 2)
  }

  children = children || []
  attributes = attributes || {}

  // Flatten nested child arrays. This is how JSX compiles some nodes.
  children = flatten(children, 2)

  // Filter out any `undefined` elements
  children = children.filter(function (i) { return typeof i !== 'undefined' })

  // if you pass in a function, it's a `Component` constructor.
  // otherwise it's an element.
  return {
    type: type,
    children: children,
    attributes: attributes
  }
}

},{"array-flatten":4,"sliced":5}],4:[function(_require,module,exports){
'use strict'

/**
 * Expose `arrayFlatten`.
 */
module.exports = arrayFlatten

/**
 * Recursive flatten function with depth.
 *
 * @param  {Array}  array
 * @param  {Array}  result
 * @param  {Number} depth
 * @return {Array}
 */
function flattenWithDepth (array, result, depth) {
  for (var i = 0; i < array.length; i++) {
    var value = array[i]

    if (depth > 0 && Array.isArray(value)) {
      flattenWithDepth(value, result, depth - 1)
    } else {
      result.push(value)
    }
  }

  return result
}

/**
 * Recursive flatten function. Omitting depth is slightly faster.
 *
 * @param  {Array} array
 * @param  {Array} result
 * @return {Array}
 */
function flattenForever (array, result) {
  for (var i = 0; i < array.length; i++) {
    var value = array[i]

    if (Array.isArray(value)) {
      flattenForever(value, result)
    } else {
      result.push(value)
    }
  }

  return result
}

/**
 * Flatten an array, with the ability to define a depth.
 *
 * @param  {Array}  array
 * @param  {Number} depth
 * @return {Array}
 */
function arrayFlatten (array, depth) {
  if (depth == null) {
    return flattenForever(array, [])
  }

  return flattenWithDepth(array, [], depth)
}

},{}],5:[function(_require,module,exports){
module.exports = exports = _require('./lib/sliced');

},{"./lib/sliced":6}],6:[function(_require,module,exports){

/**
 * An Array.prototype.slice.call(arguments) alternative
 *
 * @param {Object} args something with a length
 * @param {Number} slice
 * @param {Number} sliceEnd
 * @api public
 */

module.exports = function (args, slice, sliceEnd) {
  var ret = [];
  var len = args.length;

  if (0 === len) return ret;

  var start = slice < 0
    ? Math.max(0, slice + len)
    : slice || 0;

  if (sliceEnd !== undefined) {
    len = sliceEnd < 0
      ? sliceEnd + len
      : sliceEnd
  }

  while (len-- > start) {
    ret[len - start] = args[len];
  }

  return ret;
}


},{}]},{},[1])(1)
});