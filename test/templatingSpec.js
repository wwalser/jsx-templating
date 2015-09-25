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
  
  describe("rendering", function(){
    var basicElement = jsxTemplating.element('div', null);
    var pText = jsxTemplating.element('p', null, 'testing');
    it('basic render', function(){
      var fragment = jsxTemplating.render(basicElement);
      var element = fragment.children[0];
      expect(element.nodeName).toBe("DIV");
      expect(element.childNodes.length).toBe(0);
    });

    it('basic render', function(){
      var fragment = jsxTemplating.render(pText);
      var element = fragment.children[0];
      expect(element.nodeName).toBe("P");
      expect(element.childNodes.length).toBe(1);
    });
  });
});



