var element = require('virtual-element');
var defaults = require('object-defaults');
//var keypath = require('object-path');

function render(node) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(toNative(node));
    return fragment;
}
module.exports = {
    render,
    element
};

/**
 * Renders a component tree.
 * Returns a document fragment containing the full tree.
 */
function toNative(node){
    switch (nodeType(node)) {
        case "text": return renderTextNode(node);
        case "element": return renderElement(node);
        case "component": return renderComponent(node);
    }
}

function nodeType (node) {
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

function valType (val) {
    if (val === null) {
	return 'null';
    };
    if (val === undefined) {
	return 'undefined';
    };
    
    val = val.valueOf
	? val.valueOf()
	: Object.prototype.valueOf.apply(val);
    
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
    Object.keys(componentNode.attributes).forEach(function(attribute){
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

    Object.keys(attributes).forEach(function(attributeName){
        setAttribute(element, attributeName, attributes[attributeName]);
    });
    
    childNodes.forEach(function(child){
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

