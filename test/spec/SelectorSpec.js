/* jslint browser: true */
/* global describe, beforeEach, afterEach, expect, it */

describe("DOM5+ Selector API", function() {

  var body, div;

  beforeEach(function() {
    body = document.querySelector("body");
    div = document.createElement('div');
    div.id = 'test-div';
    body.appendChild(div);
  });

  afterEach(function() {
    body.removeChild(div);
  });

  it("should be able to find a single node", function() {
    expect(document.find("body").toString()).toEqual('[object HTMLBodyElement]');
  });

  it("should be able to find a node list", function() {
    div.appendChild(document.createElement('span'));
    div.appendChild(document.createElement('span'));
    div.appendChild(document.createElement('span'));
    expect(document.findAll("div#test-div span").length).toEqual(3);
  });

  it("should be able to find the closest node with given selector", function() {
    var div1 = document.createElement('div');
    var div2 = document.createElement('div');
    div1.appendChild(div2);
    div.appendChild(div1);
    expect(div2.closest("div#test-div").toString()).toEqual('[object HTMLDivElement]');
  });

  it("should be able to iterate over a nodelist and executing a function for each matched element", function() {
    var counter = 2;
    div.appendChild(document.createElement('span'));
    div.appendChild(document.createElement('span'));
    document.findAll('div#test-div span').each(function() {
      counter += 3;
    });
    expect(counter).toEqual(8);
  });

  it("should be able to get an element by number in a nodelist", function() {
    var div1 = document.createElement('div');
    div1.title = 'div 11';
    var div2 = document.createElement('div');
    div2.title = 'div 22';
    var div3 = document.createElement('div');
    div3.title = 'div 33';
    div.appendChild(div1);
    div.appendChild(div2);
    div.appendChild(div3);
    expect(document.findAll('div#test-div div').get(2).title).toEqual('div 33');
  });

});
