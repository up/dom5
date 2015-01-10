describe("DOM5+ Edit API", function() {
	
	var body, ul;
	
  beforeEach(function() {
    body = document.querySelector("body");
		ul = document.createElement('ul');
  });
  
  afterEach(function() {
		if(ul.parentNode != null) {
			body.removeChild(ul);
		}
  });
	
	it("should be able to create a document fragment", function() {
		var newFragment = document.fragment('span', {
			html: 'newspan',
			className: 'test'
		});  
		expect(newFragment.innerHTML + '-' + newFragment.className).toEqual('newspan-test');
	});
	
	it("should be able to prepend an element to another element as first child", function() {
		body.prepend(ul);
		expect(body.firstChild.toString()).toEqual('[object HTMLUListElement]');
	});
	
	it("should be able to append an element to another element as last child", function() {
		body.append(ul);
		expect(body.lastChild.toString()).toEqual('[object HTMLUListElement]');
	});
	
});

