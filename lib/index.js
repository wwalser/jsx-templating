var element = require('virtual-element');
var eventRegex = /^on[A-Z]/;

/**
* Renders a component tree.
* Returns a document fragment containing the full tree.
*/
function render(node){
  switch (nodeType(node)) {
    case "text": return document.createTextNode(node);
    case "element": return renderElement(node);
    case "component": return renderComponent(node);
  }
}
module.exports = {
  render,
  element
};

function nodeType (node) {
  var type = valType(node);
  if (type !== 'object') {
    return 'text';
  }
  if (valType(node.type) === 'string') {
    return 'element';
  }
  return 'component';
}

function valType (val) {
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

function normalizeComponent({render, defaultProps, name}, attributes, children) {
  var props = {
    children
  };
  Object.keys(attributes || {}).forEach(function(attribute){
    props[attribute] = attributes[attribute];
  });
  Object.keys(defaultProps || {}).forEach(function(attribute){
    //Do not overwrite existing props with it's default value
    if (!props[attribute]) {
      props[attribute] = defaultProps[attribute];
    }
  });
  return {
    props,
    render,
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
    element.appendChild(render(child));
  });

  return element;
}

function renderComponent({type, attributes, children}) {
  var component = normalizeComponent(type, attributes, children);
  var fn = component.render;
  if (!fn) throw new Error('Component needs a render function');
  var node = fn(component.props);
  if (!node) throw new Error('Render function must return an element.');
  return render(node);
}
