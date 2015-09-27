describe("jsxTemplating", function() {
  it("exposes global 'element' on jsxTemplating", function() {
    expect(typeof jsxTemplating.element).toBe("function");
  });
  
  it("exposes global 'render' on jsxTemplating", function() {
    expect(typeof jsxTemplating.render).toBe("function");
  });
  
  describe("element object creation", function(){
    it("Basic element correctly normalizes input", function(){
      function isNormalisedAssertions(element) {
        //type always the same
        expect(element.type).toBe('div');
        
        //attributes normalised
        expect(element.attributes instanceof Object).toBe(true);
        
        //children normalised
        expect(Array.isArray(element.children)).toBe(true);
        expect(element.children.length).toBe(0);
      }
      isNormalisedAssertions(jsxTemplating.element('div', null));
      isNormalisedAssertions(jsxTemplating.element('div', {}));
    });
    
    it("Children made into array", function(){
      var el = jsxTemplating.element('div', null, "foo");
      expect(Array.isArray(el.children)).toBe(true);
      expect(el.children.length).toBe(1);
      
      var el = jsxTemplating.element('div', null, "foo", "bar", {});
      expect(el.children.length).toBe(3);
    });
    
    it("Children array contains the same objects as were passed", function(){
      var child = {foo: 'bar'};
      var el = jsxTemplating.element('div', null, child);
      expect(el.children).toContain(child);
    });
  });

  describe("Rendering", function(){
    //for building testable elements
    function render(element) {
      return {
        test: function(testFunc){
          return function(){
            testFunc(jsxTemplating.render(element));
          };
	}
      };
    };

    //test elements
    var basicElement = jsxTemplating.element('div', null);
    var pText = jsxTemplating.element('p', null, 'testing');
    var withAttrs = jsxTemplating.element('span', {supportsAttrs: true, class: 'foo bar'});
    var eventFired = false;
    var withEvent = jsxTemplating.element('span', {onClick: function(e){eventFired = true;}});
    var innerHtml = jsxTemplating.element('p', {innerHTML: '<a href="http://www.google.com">Google</a>'});
    
    describe("standard elements", function(){
      it('Basic render', render(basicElement).test(function(element){
        expect(element.nodeName).toBe("DIV");
        expect(element.childNodes.length).toBe(0);
      }));

      it('Element with text child', render(pText).test(function(element){
        expect(element.nodeName).toBe("P");
        expect(element.childNodes.length).toBe(1);
        expect(element.textContent).toBe('testing');
      }));
      
      it('Element with attributes', render(withAttrs).test(function(element){
        expect(element.getAttribute('supportsAttrs')).toBe('true');
        expect(element.classList).toContain('foo');
        expect(element.classList).toContain('bar');
      }));

      it('Event binding works', render(withEvent).test(function(element){
        var event = document.createEvent('Event');
        event.initEvent('click', true, true);
        element.dispatchEvent(event);
        expect(eventFired).toBe(true);
      }));

      it('innerHTML can be used to ignore escaping', render(innerHtml).test(function(element){
        expect(element.querySelectorAll('a')[0].getAttribute('href')).toBe('http://www.google.com');
      }));
    });

    describe("components", function(){
      //Components
      var JustRender = jsxTemplating.element({
        render: function(){
          return withAttrs;
        }
      }, null);
      var WithDefaultProps = {
        defaultProps: {
          class: 'baz',
          unique: true
        },
        render: function(props){
          return jsxTemplating.element('span', props);
        }
      };
      var UsesChildren = {
        render: function(props){
          return jsxTemplating.element('div', {class: 'container'}, props.children);
        }
      };
      var defaultProps = jsxTemplating.element(WithDefaultProps, null);
      var propsOverwritten = jsxTemplating.element(WithDefaultProps, {class: 'foo'});
      var withChildren = jsxTemplating.element(UsesChildren, null,
        jsxTemplating.element('p', null, "Top level!"),
        jsxTemplating.element('span', null, jsxTemplating.element('p', null, 'Deeper!')));

      it('Basic component', render(JustRender).test(function(element){
        expect(element.getAttribute('supportsAttrs')).toBe('true');
        expect(element.classList).toContain('foo');
        expect(element.classList).toContain('bar');
      }));

      it('Default props are added to component', render(defaultProps).test(function(element){
        expect(element.classList).toContain('baz');
        expect(element.getAttribute('unique')).toBe('true');
      }));

      it("Default props are overwritten by provided props", render(propsOverwritten).test(function(element){
        expect(element.classList).not.toContain('baz');
        expect(element.classList).toContain('foo');
      }));

      it("Child elements can be accessed and rendered correctly.", render(withChildren).test(function(element){
        expect(element.querySelectorAll('p')[0].textContent).toBe('Top level!');
        expect(element.querySelectorAll('span p')[0].textContent).toBe('Deeper!');
      }));
    });
  });
});



