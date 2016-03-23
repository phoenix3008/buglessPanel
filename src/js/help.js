var Help = {
    _eventHandlers: {},
    screenWidth: function() {
        return document.documentElement.clientWidth;
    },
    screenHeight: function() {
        return document.documentElement.clientHeight
    },
    calculatePercentageX: function(value) {
        return value * 100 / window.innerWidth;
    },
    calculatePercentageY: function(value) {
        return value * 100 / window.innerHeight;
    },
    hasClass: function(el, className) {
        if (el.classList)
            return el.classList.contains(className);
        else
            return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    },
    addClass: function(el, className) {
        if (el.classList)
            el.classList.add(className);
        else if (!hasClass(el, className))
            el.className += " " + className;
    },
    removeClass: function(el, className) {
        if (el.classList)
            el.classList.remove(className);
        else if (hasClass(el, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
            el.className = el.className.replace(reg, ' ')
        }
    },
    addListener: function(element, event, handler, capture) {
        if(!(element in this._eventHandlers)) {
            this._eventHandlers[element] = {};
        }

        if(!(event in this._eventHandlers[element])) {
            this._eventHandlers[element][event] = [];
        }

        this._eventHandlers[element][event].push([handler, capture]);
        element.addEventListener(event, handler, capture);
    },
    removeListener: function(element, event) {
        if(element in this._eventHandlers) {
            if(event in this._eventHandlers[element]) {
                var handlers = this._eventHandlers[element][event];
                for(var i = 0, l = handlers.length; i < l; i++) {
                    var handler = handlers[i];
                    element.removeEventListener(event, handler[0], handler[1]);
                }
            }
        }
    },
    triggerEvent: function(element, eventName, eventParams) {
        var customEvent = document.createEvent('Event');
        customEvent.initEvent(eventName, true, true);
        for (var param in eventParams) {
            customEvent[param] = eventParams[param];
        }
        element.dispatchEvent(customEvent);
    },
    closest: function(el, selector) {
        var matchesFn, parent;

        // find vendor prefix
        ['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'].some(function(fn) {
            if(typeof document.body[fn] == 'function') {
                matchesFn = fn;
                return true;
            }
            return false;
        })

        // traverse parents
        while (el !== null) {
            parent = el.parentElement;
            if(parent!==null && parent[matchesFn](selector)) {
                return parent;
            }
            el = parent;
        }
        return null;
    }
}
