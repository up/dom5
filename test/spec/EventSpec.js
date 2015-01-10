/* jslint browser: true */
/* global describe, expect, it */

describe("DOM5+ Event API", function() {
  
  var isReady = false;
    
  document.ready(function(){
    isReady = true;
  });
  
  it("should be able to call a function if DOM is ready", function() {
    expect(isReady).toBeTruthy();
  });

});

