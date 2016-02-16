Panel.POSITION_LEFT = 1;
Panel.POSITION_RIGHT = 2;
Panel.POSITION_TOP = 4;
Panel.POSITION_BOTTOM = 6;

function Panel(selector, params) {
    var self = this;
    self.element = document.querySelector(selector);
    self.innerElement = self.element.querySelector('.inner');
    self.x = null;
    self.y = null;
    self.isOpened = false;

    if(!self.element)
        throw new Error('Panel "' + selector + '" not found');

    if(!self.innerElement)
        throw new Error('Panel inner not found');

    if(!params.position)
        throw new Error('Please specify the panel position');


    // Params
    self.onShow = params.onShow || null;
    self.onShown = params.onShown || null;
    self.onClose = params.onClose || null;
    self.onClosed = params.onClosed || null;
    self.position = params.position;
    self.width = self.w = params.width || 100; // in %
    self.height = params.height || 100; // in %
    self.maxWidth = params.maxWidth || null; // in px
    self.exceptions = params.exceptions || [];

    BuglessPanels.panels.push(self);

    self.applyPanelSizes();


    // iOS fix
    if(self.innerElement.querySelectorAll('input[type="text"], select').length) {
        var inputs = self.innerElement.querySelectorAll('input[type="text"], select');
        var fixDiv = document.createElement('div');
        fixDiv.className = 'iosfix';
        for(var i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('focusout', function(e) {
                self.innerElement.appendChild(fixDiv);
                setTimeout(function() {
                    self.innerElement.querySelector('.iosfix').remove()
                }, 500);
            });
        }
    }

    //orientationchange
    window.addEventListener('resize', function(e) {
        setTimeout(function() {
            self.applyPanelSizes();
        }, 100);
    }, false);

    self.elementCMD = new CMD(self.element, {
        threshold: BuglessPanels.moveThreshold,
        preventScroll: true,
        innerElement: self.innerElement,
        exceptions: self.exceptions
    });

    if(params.closeBySwipe !== false) {
        switch(self.position) {
            case Panel.POSITION_LEFT:
                self.x = -100;
                self.y = 0;
                self.listenLeftSwipe();
                break;
            case Panel.POSITION_RIGHT:
                self.x = 100;
                self.y = 0;
                self.listenRightSwipe();
                break;
            case Panel.POSITION_TOP:
                self.x = 0;
                self.y = -100;
                self.listenTopSwipe();
                break;
            case Panel.POSITION_BOTTOM:
                self.x = 0;
                self.y = 100;
                self.listenBottomSwipe();
                break;
            default:
                throw new Error('Unknown panel position:', self.position);
                break;
        }
    }
}

Panel.prototype.applyPanelSizes = function() {
    var self = this;
    if(self.maxWidth !== null) {
        if((Help.screenWidth() * self.w / 100) > self.maxWidth) {
            self.width = self.maxWidth * 100 / Help.screenWidth();
        } else {
            self.width = self.w;
        }
    }
    self.element.style.width = self.width + '%';
    self.element.style.height = self.height + '%';
}

Panel.prototype.listenTopSwipe = function() {
    var self = this,
        sy = null;

    self.elementCMD.on('touchstart', function(e) {
        self.animateOff();
        sy = self.height - Help.calculatePercentageY(e.touches[0].clientY);
    });

    self.elementCMD.on('movetop', function(e) {
        if(e.direction !== false && (self.element.scrollTop + self.element.offsetHeight) >= self.innerElement.offsetHeight) {
            if(self.onClose && !self.onCloseWasCalled) {
                self.onClose(self);
                self.onCloseWasCalled = true;
            }
            var cursorPos = Help.calculatePercentageY(e.touches[0].clientY); //%
            var x = cursorPos * 100 / self.height;
            self.moveY(x + sy);
        }
    });

    self.elementCMD.on('moveendtop', function(e) {
        self.onCloseWasCalled = false;
        if(self.y < 100 - BuglessPanels.panelThreshold) {
            self.close();
        } else {
            self.open();
        }
    });
}


Panel.prototype.listenBottomSwipe = function() {
    var self = this,
        sy = null;

    self.elementCMD.on('touchstart', function(e) {
        self.animateOff();
        sy = self.height - Help.calculatePercentageY(Help.screenHeight() - e.touches[0].clientY);
    });

    self.elementCMD.on('movebottom', function(e) {
        if(e.direction !== false && self.element.scrollTop <= 0) {
            if(self.onClose && !self.onCloseWasCalled) {
                self.onClose(self);
                self.onCloseWasCalled = true;
            }

            var t = Help.calculatePercentageY(e.touches[0].clientY) * 100 / self.height;
            t = t - ((100 - self.height) * 100 / self.height)
            self.moveY(t - sy);
        }
    });

    self.elementCMD.on('moveendbottom', function(e) {
        self.onCloseWasCalled = false;
        if(self.y > BuglessPanels.panelThreshold) {
            self.close();
        } else {
            self.open();
        }
    });
}


Panel.prototype.listenLeftSwipe = function() {
    var self = this,
        sx = null;

    self.elementCMD.on('touchstart', function(e) {
        self.animateOff();
        sx = self.width - Help.calculatePercentageX(e.touches[0].clientX);
    });

    self.elementCMD.on('moveleft', function(e) {
        if(e.direction !== false) {
            if(self.onClose && !self.onCloseWasCalled) {
                self.onClose(self);
                self.onCloseWasCalled = true;
            }
            var cursorPos = Help.calculatePercentageX(e.touches[0].clientX); //%
            var x = cursorPos * 100 / self.width;
            self.moveX(x + sx);
        }
    });

    self.elementCMD.on('moveendleft', function(e) {
        self.onCloseWasCalled = false;
        if(self.x < 100 - BuglessPanels.panelThreshold) {
            self.close();
        } else {
            self.open();
        }
    });
}

Panel.prototype.listenRightSwipe = function() {
    var self = this,
        sx = null;

    self.elementCMD.on('touchstart', function(e) {
        self.animateOff();
        sx = self.width - Help.calculatePercentageX(Help.screenWidth() - e.touches[0].clientX);
    });

    self.elementCMD.on('moveright', function(e) {
        if(e.direction !== false) {
            if(self.onClose && !self.onCloseWasCalled) {
                self.onClose(self);
                self.onCloseWasCalled = true;
            }
            var x = Help.calculatePercentageX(e.touches[0].clientX) * 100 / self.width;
            x = x - ((100 - self.width) * 100 / self.width)
            self.moveX(x - sx);
        }
    });

    self.elementCMD.on('moveendright', function(e) {
        self.onCloseWasCalled = false;
        if(self.x > BuglessPanels.panelThreshold) {
            self.close();
        } else {
            self.open();
        }
    });
}

Panel.prototype.animateOff = function() {
    Help.removeClass(this.element, 'animate');
}

Panel.prototype.animateOn = function() {
    Help.addClass(this.element, 'animate');
}

Panel.prototype.show = function() {
    BuglessPanels.backdropOn();
    this.element.style.display = 'block';
}

Panel.prototype.hide = function() {
    this.element.style.display = 'none';
}

Panel.prototype.moveX = function (value) {
    if(this.position == Panel.POSITION_LEFT && value > 100) return false;
    if(this.position == Panel.POSITION_RIGHT && value < 0) return false;
    this.x = value;
    value = this.position == Panel.POSITION_LEFT ? (-100 + value) : value;
    this.element.style.transform = 'translateX(' + value + '%)';
}

Panel.prototype.moveY = function (value) {
    if(this.position == Panel.POSITION_TOP && value > 100) return false;
    if(this.position == Panel.POSITION_BOTTOM && value < 0) return false;
    this.y = value;
    value = this.position == Panel.POSITION_TOP ? (-100 + value) : value;
    this.element.style.transform = 'translateY(' + value + '%)';
}

Panel.prototype.close = function () {
    var self = this;
    BuglessPanels.activePanel = null;
    self.animateOn();
    switch(this.position) {
        case Panel.POSITION_LEFT:
            this.moveX(0);
            break;
        case Panel.POSITION_RIGHT:
            this.moveX(100);
            break;
        case Panel.POSITION_TOP:
            this.moveY(0);
            break;
        case Panel.POSITION_BOTTOM:
            this.moveY(100);
            break;
    }

    setTimeout(function() {
        BuglessPanels.backdropOff();
        self.hide();
        if(self.onClosed) {
            self.onClosed(self);
        }
        self.isOpened = false;
    }, BuglessPanels.getAnimationTime('.animate'));
}

Panel.prototype.open = function () {
    var self = this;
    BuglessPanels.activePanel = self;
    self.show();
    if(self.onShow && !self.isOpened && !self.onShowWasCalled) {
        self.onShow(self);
    }
    var intervalId = setInterval(function() {
        if(self.element.style.display == 'block') {
            clearInterval(intervalId);
            self.animateOn();
            switch(self.position) {
                case Panel.POSITION_LEFT:
                    self.moveX(100);
                    break;
                case Panel.POSITION_RIGHT:
                    self.moveX(0);
                    break;
                case Panel.POSITION_TOP:
                    self.moveY(100);
                    break;
                case Panel.POSITION_BOTTOM:
                    self.moveY(0);
                    break;
            }

            setTimeout(function() {
                if(self.onShown && !self.isOpened) {
                    self.onShown(self);
                }
                self.isOpened = true;
            }, BuglessPanels.getAnimationTime('.animate'));
        }
    }, 50);
}
