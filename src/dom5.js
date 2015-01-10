/**
 * dom5
 * ES5 DOM Monkey Patching
 *
 * Extends native objects (Window, Document, Element and NodeList) 
 * and some DOM related String and Event methods
 *
 * copyright (c) 2014 - 2015 Uli Preuss
 * http://github.com/up/dom5
 */

/* jslint browser: true */
/* global Document, Element, Window, NodeList, CSSStyleDeclaration */

(function(Document, Element, Window, NodeList, CSSStyleDeclaration, String, Event) {

  [].forEach.call(arguments, function(item) {
    
    item.fn = item.prototype;

    // Shortcuts
    if (item === Document || item === Element || item === Window) {
      item.fn.on = item.fn.addEventListener;
      item.fn.off = item.fn.removeEventListener;
    }
    if (item === Document || item === Element) {
      item.fn.find = item.fn.querySelector;
      item.fn.findAll = item.fn.querySelectorAll;
    }
    if (item === Element) {
      item.fn.klass = item.className;
    }
    
    // Extensions
    if (item === Document || item === Element || item === Window) {
      item.fn.trigger = function(evt) {
        fireEvent(this, evt);
      };
    }

  });
  
  function fireEvent(obj, evt) {
    var evObj, fireOnThis = obj;
    if (document.createEvent) {
      evObj = document.createEvent('Event');
      evObj.initEvent(evt, true, false);
      fireOnThis.dispatchEvent(evObj);
    } else if (document.createEventObject) { //IE
      evObj = document.createEventObject();
      fireOnThis.fireEvent('on' + evt, evObj);
    }
  }

  function camelCase(input) { 
    /*jshint unused: false */
    return input.toLowerCase().replace(/-(.)/g, function(match, group) {
      return group.toUpperCase();
    }); 
    /*jshint unused: true */
  }

  function extend(domobject, name, value) {
    return Object.defineProperty(domobject.fn, name, {
      configurable: true,
      writable: true,
      enumerable: false,
      value: value
    });
  }

  if (!CSSStyleDeclaration.fn.set) {
    extend(CSSStyleDeclaration, 'set', function(properties) {
      var style = this,
          prefixes = ['webkit', 'moz', 'ms', 'o'];

      Object.keys(properties).forEach(function(property) {
        var value = properties[property];
        if (typeof style[property] === 'string') {
          style[property] = value;
        } else {
          var capitalized = property.charAt(0).toUpperCase() + property.slice(1);
          for (var i = 0; i < prefixes.length; i++) {
            property = prefixes[i] + capitalized;
            if (typeof style[property] === 'string') {
              style[property] = value;
              break;
            }
          }
        }
      });

    });
  }

  /**
   * Specify a function to execute when the DOM is fully loaded.
   *
   * @example
   * document.ready(function(){
   *   // do something
   * });
   *
   * @param {Function} function to execute
  */
  if (!Document.fn.ready) {
    extend(Document, 'ready', function(func) {
      document.on("DOMContentLoaded", func, false);
    });
  }

  /**
   * Create a document fragment.
   *
   * @example
   * document.fragment('span', {
   *   html: 'newspan',
   *   className: 'test'
   * });
   *
   * @param {String} name Tag name
   * @param {Object} config Object with element details
   * @return element / document fragment
  */
  if (!Document.fn.fragment) {
    extend(Document, 'fragment', function(tagname, config) {
      if (tagname && typeof tagname === 'string') {
        var tag = document.createElement(tagname);
        if (config && typeof config === 'object') {
          for (var item in config) {
            if (config.hasOwnProperty(item)) {
              if (item === 'html') {
                tag.innerHTML = config.html.replace(/ /g, '&nbsp;'); // ???
              } else {
                tag[item] = config[item];
              }
            }
          }
        }
        return tag;
      }
      return false;
    });
  }

  if (!Element.fn.matches) {
    Element.fn.matches = Element.fn.webkitMatchesSelector || 
      Element.fn.mozMatchesSelector || 
      Element.fn.msMatchesSelector || 
      Element.fn.oMatchesSelector;
  }

  /**
   * For matched element, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
   *
   * @example
   * document.find('li span#inner').closest("ul.accordion");
   *
   * @param {String} selector Selector
   * @return Matched element if found or false
  */
  if (!Element.fn.closest) {
    extend(Element, 'closest', function(selector) {
      var elem = this;
      while (elem) {
        if (elem.matches(selector)) {
          return elem; // Make method chainable
        } else {
          elem = elem.parentElement;
        }
      }
      return false;
    });
  }

  /**
   * Store string data associated with the matched element or return the value at the named data store of matched elements.
   *
   * @example
   * document.find('body').data('foo', '42');
   * document.find('body').data('foo'); // -> 42
   *
   * @param {String} name data attribute name without 'data-'
   * @param {String} value data attribute value (optional for setting)
   * @return data attribute value if only 1 argument
   * @return Element if 2 arguments (chainable method)  
  */
  if (!Element.fn.data) {
    extend(Element, 'data', function(name, value) {
      name = 'data-' + name.replace(/([A-Z])/g, '-$1').toLowerCase();
      var data = this.attr(name);
      if(value) {
        this.attr(name, typeof value === 'object' ? JSON.stringify(value) : value);
      } else {
        if(/^[\[\{]/.test(data)) {
          return JSON.parse(data);
        } else {
          return data;          
        }
      }
      return this;
    });
  }
  
  /**
   * Remove a previously-stored piece of data in data attribute.
   *
   * @example
   * document.find('body').removeData('foo');
   *
   * @param {String} name data attribute name without 'data-'
   * @return Element (chainable method)
  */
  if (!Element.fn.removeData) {
    extend(Element, 'removeData', function(name) {
      name = 'data-' + name.replace(/([A-Z])/g, '-$1').toLowerCase();
      this.removeAttr(name);
      return this;
    });
  }

  if (!Element.fn.hasClass) {
    extend(Element, 'hasClass', function(name) {
      return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(this.className);
    });
  }

  if (!Element.fn.addClass) {
    extend(Element, 'addClass', function(name) {
      this.className = this.className ? [this.className, name].join(' ') : name;
      return this; // Make method chainable
    });
  }

  if (!Element.fn.removeClass) {
    extend(Element, 'removeClass', function(name) {
      if (this.hasClass(name)) {
        var c = this.className;
        this.className = c.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
      }
      return this; // Make method chainable
    });
  }

  if (!Element.fn.toggleClass) {
    extend(Element, 'toggleClass', function(name) {
      if (this.hasClass(name)) {
        var c = this.className;
        this.className = c.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
      } else {
        this.className = this.className ? [this.className, name].join(' ') : name;
      }
      return this; // Make method chainable
    });
  }

  /**
   * Insert child element at first position (first child).
   *
   * @example
   * document.find('ul').prepend(document.createElement('li'));
   *
   * @param {Element} newChild
   * @return Element (chainable method)
  */
  if (!Element.fn.prepend) {
    extend(Element, 'prepend', function(newChild) {
      this.insertBefore(newChild, this.firstChild);
      return this;
    });
  }

  /**
   * Insert child element at last position (last child).
   *
   * @example
   * document.find('ul').append(document.createElement('li'));
   *
   * @param {Element} newChild
   * @return Element (chainable method)
  */
  if (!Element.fn.append) {
    extend(Element, 'append', function(newChild) {
      this.appendChild(newChild);
      return this; // Make method chainable
    });
  }

  /**
   * Get the value of an attribute or set an attributes for the matched element.
   *
   * @example
   * document.find('body').attr('foo', '42');
   * var foo = document.find('body').attr('foo');
   *
   * @param {String} name Attribute name
   * @param {String} value Attribute value
   * @return Attribute value if only 1 argument
   * @return Element (chainable method)
  */
  if (!Element.fn.attr) {
    extend(Element, 'attr', function(name, value) {
      if (name) {
        if (!value) {
          return this.getAttribute(name);
        } else {
          this.setAttribute(name, value);
        }
      }
      return this;
    });
  }

  /**
   * Remove attribute.
   *
   * @example
   * document.find('body').removeAttr('foo');
   *
   * @param {String} name Attribute name
   * @return Element (chainable method)
  */
  if (!Element.fn.removeAttr) {
    extend(Element, 'removeAttr', function(name) {
      this.removeAttribute(name);
      return this;
    });
  }

  if (!Element.fn.css) {
    extend(Element, 'css', function(properties, tonumber) {
      if (typeof properties === 'string') {
        var value = document.defaultView.getComputedStyle(this, null).getPropertyValue(properties);
        if (tonumber) {
          value = parseInt(value, 10);
          return value === null || isNaN(value) ? 0 : value;
        }
        return value;
      } else {
        var camelCasedProperties = {};
        for (var prop in properties) {
          if (properties.hasOwnProperty(prop)) {
            camelCasedProperties[camelCase(prop)] = properties[prop];
          }
        }
        this.style.set(camelCasedProperties);
      }
      return this; // Make method chainable
    });
  }

  /**
   * Iterate over a nodelist, executing a function for each matched element. 
   *
   * @example
   * document.findAll('li').each(function(){
   *  // do something with element
   * });
   *
   * @param {Function} Function
  */
  if (!NodeList.fn.each) {
    extend(NodeList, 'each', function(func) {
      if (typeof func === 'function') {
        [].forEach.call(this, function(elem, index) {
          func(elem, index);
        });
      }
    });
  }

  /**
   * Retrieve one of the elements in a nodelist.
   *
   * @example
   * var secondItem = document.findAll('li').get(1);
   *
   * @param {Number} num
   * @return Matched element (chainable method)
  */
  if (!NodeList.fn.get) {
    extend(NodeList, 'get', function(num) {
      if (num < 0) {
        num = num * -1;
        return this[this.length - num];
      } else {
        return this[num];
      }
    });
  }
  
  String.fn.render = function(placeholder, value){
    var re = new RegExp('{{' + placeholder + '}}', 'g');
    return this.replace(re, value);
  };
  
  // TODO: write test(s)
  /**
   * Specify an event target (mouse or touch).
   *
   * @example
   *
   * @return {Event Target} 
  */
  Event.fn.deviceTarget = function() {
    return this.targetTouches ? this.targetTouches[0].target : this.target;
  };
  
  Window.fn.touchSupport = 'ontouchstart' in window || 'onmsgesturechange' in window;
  

}(Document, Element, Window, NodeList, CSSStyleDeclaration, String, Event));
