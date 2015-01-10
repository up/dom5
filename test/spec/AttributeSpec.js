/* jslint browser: true */
/* global describe, beforeEach, afterEach, expect, it */
describe("DOM5+ Attribute API", function() {
  
  var body;
  
  beforeEach(function() {
    body = document.querySelector("body");
  });

  describe("All Attributes", function() {

    afterEach(function() {
      body.removeAttribute('bar');
    });

    it("should be able to get an attribute value", function() {
      body.setAttribute('bar', 'baz');
      expect(document.find("body").attr('bar')).toEqual('baz');
    });

    it("should be able to set an attribute value", function() {
      document.find("body").attr('bar', 'baz9');
      expect(document.find("body").attr('bar')).toEqual('baz9');
    });

    it("should be able to remove an attribute", function() {
      body.setAttribute('bar', 'baz');
      document.find("body").removeAttr('bar');
      expect(document.find("body").attr('bar')).toBeNull();
    });

  });

  describe("Data Attributes", function() {

    afterEach(function() {
      body.removeAttribute('data-foo');
    });

    it("should be able to get a string value", function() {
      body.setAttribute('data-foo', '42');
      expect(body.data("foo")).toEqual('42');
    });

    it("should be able to get a JSON string value as an object", function() {
      body.setAttribute('data-foo', '{"number":16}');
      expect(document.find("body").data("foo").number).toEqual(16);
    });
  
    it("should be able to set a string value", function() {
      document.find("body").data('foo', '42');
      expect(body.getAttribute('data-foo')).toEqual('42');
    });

    it("should be able to set an object as a JSON string value", function() {
      document.find("body").data('foo', {number: 16});
      expect(body.getAttribute('data-foo')).toEqual('{"number":16}');
    });

    it("should be able to remove a data attribute", function() {
      body.setAttribute('data-foo', '42');
      document.find("body").removeData('foo');
      expect(body.getAttribute('data-foo')).toEqual(null);
    });

  });

});

