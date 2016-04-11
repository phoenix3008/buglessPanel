function CMD(element, params) {
    this.element = element;
    this.threshold = params.threshold || 20;
    this.preventScroll = params.preventScroll || false;
    this.innerElement = params.innerElement;
    this.exceptions = params.exceptions || [];

    this.startX = null;
    this.startY = null;
    this._startTarget = null;
    this.initListeners();
}

CMD.prototype.isException = function(target) {
    var self = this,
        el = self.exceptions.length;
    if(el === 0) return false;
    for(var i = 0; i < el; i++) {
        if(Help.closest(target, self.exceptions[i]) || target == document.querySelector(self.exceptions[i])) {
            return true;
        }
    }
    return false;
}

CMD.prototype.initListeners = function () {
    var self = this,
        stableDirection = false,
        moveOrientation = false,
        eventParams = {
            direction: null,
            touches: null,
            deltaX: null,
            deltaY: null
        };

    self.element.addEventListener('touchstart', function(e) {
        self._startTarget = e.target;
        self.startX = e.touches[0].clientX;
        self.startY = e.touches[0].clientY;
        if(self.isException(self._startTarget)) return;
    }, false);

    self.element.addEventListener('touchmove', function(e) {
        var deltaX = e.touches[0].clientX - self.startX,
            deltaY = e.touches[0].clientY - self.startY,
            movementX = Math.abs(deltaX) > 0,
            movementY = Math.abs(deltaY) > 0;

        if(self.preventScroll) {
            if(deltaY > 0 && self.element.scrollTop <= 0) {
                e.preventDefault();
            }
            if(self.innerElement && deltaY < 0 && self.element.scrollTop + self.element.offsetHeight >= self.innerElement.offsetHeight) {
                e.preventDefault();
            }
        }

        if(self.isException(self._startTarget)) return;

        eventParams = {
            touches: e.touches,
            deltaX: deltaX,
            deltaY: deltaY,
            direction: stableDirection
        };

        if(stableDirection === false) {
            if(Math.abs(deltaX) > self.threshold) {
                stableDirection = deltaX > 0 ? 'right' : 'left';
                moveOrientation = 'horizontal';
            }
            if(Math.abs(deltaY) > self.threshold) {
                stableDirection = deltaY > 0 ? 'bottom' : 'top';
                moveOrientation = 'vertical';
            }

            if(movementX) {
                if(deltaX > 0) {
                    self.triggerEvent('moveright', eventParams);
                } else if(deltaX < 0) {
                    self.triggerEvent('moveleft', eventParams);
                }
            }

            if(movementY) {
                if(deltaY > 0) {
                    self.triggerEvent('movebottom', eventParams);
                } else if(deltaY < 0) {
                    self.triggerEvent('movetop', eventParams);
                }
            }

        } else {
            if((stableDirection == 'right' || stableDirection == 'left') && movementY) {
                e.preventDefault();
            }

            if((stableDirection == 'top' || stableDirection == 'bottom') && movementX) {
                e.preventDefault();
            }

            self.triggerEvent('move' + stableDirection, eventParams);
        }

    }, false);

    self.element.addEventListener('touchend', function(e) {
        if(self.isException(self._startTarget)) return;
        self.triggerEvent('moveend' + stableDirection, eventParams);
        stableDirection = false;
    }, false);

    self.element.addEventListener('touchcancel', function(e) {
        if(self.isException(self._startTarget)) return;
        self.triggerEvent('moveend' + stableDirection, eventParams);
        stableDirection = false;
    }, false);
}

CMD.prototype.triggerEvent = function (eventName, eventParams) {
    Help.triggerEvent(this.element, eventName, eventParams);
}

CMD.prototype.on = function (event, callback) {
    Help.addListener(this.element, event, callback, false);
}

CMD.prototype.off = function (event) {
    Help.removeListener(this.element, event);
}
