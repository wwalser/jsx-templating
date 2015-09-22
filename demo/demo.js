/** @jsx templating.element */
var templating = require('../build/jsx-templating');

//implementation of the component.
var MainContent = {
    render: function(props){
	return <div id="content"><p>{props.children}</p></div>;
    }
};

function wrapper(header) {
    return <div id="wrapper"><h2>{header}</h2><MainContent>Testing main content component!</MainContent></div>;
}

//init the demo.
function init(){
    document.body.appendChild(templating.render(wrapper("Testing Component")));
}

init();
