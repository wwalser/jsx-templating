var element = require('virtual-element');
var eventRegex = /^on[A-Z]/;

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
    case "text": return document.createTextNode(node);
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

function normalizeComponent({type, children, attributes, initialState, defaultProps, name}) {
  var component = type;
  var props = {
    children: children
  };
  Object.keys(attributes).forEach(function(attribute){
    props[attribute] = attributes[attribute];
  });
  Object.keys(defaultProps || {}).forEach(function(attribute){
    //Do not overwrite existing props with it's default value
    if (!props[attribute]) {
      props[attribute] = defaultProps[attribute];
    }
  });
  return {
    component,
    props,
    render: typeof component === 'function' ? component : component.render,
    state: initialState ? initialState(props) : {},
    displayName: name || 'Component'
  };
}

function renderElement({type, attributes, children}) {
  let element = document.createElement(type);

  Object.keys(attributes).forEach(function(attributeName){
    if (eventRegex.test(attributeName)) {
      element.addEventListener(attributeName.substr(2).toLowerCase(), attributes[attributeName]);
    } else {
      setAttribute(element, attributeName, attributes[attributeName]);
    }
  });

  children.forEach(function(child){
    element.appendChild(toNative(child));
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
