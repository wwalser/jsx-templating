/** @jsx templating.element */
var templating = require('../build/jsx-templating');

//implementation of the component.
var MainContent = {
    render: function(props){
	var clickHandler = (event) => {
	    console.log(event.target.getAttribute('href'));
	    event.preventDefault();
	};
	return <div id="content">
            <a onClick={clickHandler} href="http://www.google.com">Test link</a>
            {props.children}
	</div>;
    }
};

function wrapper(header) {
    return <div id="wrapper">
	<h2>{header}</h2>
	<MainContent><span><p>Testing main content component!</p></span></MainContent>
	<span class="icon"></span>
    </div>;
}

//init the demo.
function init(){
    document.body.appendChild(templating.render(wrapper("Testing Component")));
}

init();
