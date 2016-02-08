var BuglessPanels = {
    moveThreshold: 20, // in px
    panelThreshold: 40, // in %
    panels: [],
    activePanel: null,
    exceptions: [],
    _startTarget: null,
    init: function(params) {
        var self = this;
        this.params = params;

        if(!params.content)
            throw new Error('"content" parameter was not passed');

        this.content = params.content;
        this.contentElement = document.querySelector(params.content);
        if(!this.contentElement)
            throw new Error('Content element not found');

        this.moveThreshold = this.params.moveThreshold || 20;
        this.panelThreshold = this.params.panelThreshold || 40;
        this.exceptions = this.params.exceptions || [];

        if(params.leftPanel) {
            if(!(params.leftPanel instanceof Panel))
                throw new Error('"leftPanel" parameter must be an instance of Panel');
            this.leftPanel = params.leftPanel;
            this.leftPanel.position = Panel.POSITION_LEFT;
            this.initContentCMD();
            this.listenRightSwipe();
        }

        if(params.rightPanel) {
            if(!(params.rightPanel instanceof Panel))
                throw new Error('"leftPanel" parameter must be an instance of Panel');
            this.rightPanel = params.rightPanel;
            this.rightPanel.position = Panel.POSITION_RIGHT;
            this.initContentCMD();
            this.listenLeftSwipe();
        }

        this.initBackdrop();
    },
    initBackdrop: function() {
        var self = this;
        this.backdrop = document.querySelector('.bugless-backdrop');
        if(this.backdrop == null) {
            this.backdrop = document.createElement('div');
            this.backdrop.setAttribute('class', 'bugless-backdrop');
            document.body.appendChild(this.backdrop);

            var sposx = null, sposy = null;
            this.backdrop.addEventListener('touchstart', function(e) {
                sposx = e.touches[0].clientX;
                sposy = e.touches[0].clientY;
                self.activePanel.animateOff();
            });

            this.backdrop.addEventListener('touchmove', function(e) {
                if(self.activePanel.position == Panel.POSITION_LEFT || self.activePanel.position == Panel.POSITION_RIGHT) {
                    if(sposy != e.touches[0].clientY) {
                        e.preventDefault();
                    }
                    var cx = Help.calculatePercentageX(e.touches[0].clientX);
                    var x = cx * 100 / self.activePanel.width;
                }

                if(self.activePanel.position == Panel.POSITION_TOP || self.activePanel.position == Panel.POSITION_BOTTOM) {
                    e.preventDefault();
                    var cy = Help.calculatePercentageY(e.touches[0].clientY); //%
                    var y = cy * 100 / self.activePanel.height;
                }

                if(self.activePanel.position == Panel.POSITION_TOP) {
                    if(cy <= self.activePanel.height) {
                        self.activePanel.moveY(y);
                    }
                }

                if(self.activePanel.position == Panel.POSITION_BOTTOM) {
                    if(cy >= (100 - self.activePanel.height)) {
                        self.activePanel.moveY(y - ((100 - self.activePanel.height) * 100 / self.activePanel.height));
                    }
                }

                if(self.activePanel.position == Panel.POSITION_LEFT) {
                    if(cx <= self.activePanel.width) {
                        self.activePanel.moveX(x);
                    }
                }

                if(self.activePanel.position == Panel.POSITION_RIGHT) {
                    if(cx >= (100 - self.activePanel.width)) {
                        self.activePanel.moveX(x - ((100 - self.activePanel.width) * 100 / self.activePanel.width));
                    }
                }
            }, false);

            this.backdrop.addEventListener('touchend', function(e) {
                if(
                    (sposx < e.changedTouches[0].clientX + 5) && (sposx > e.changedTouches[0].clientX - 5) &&
                    (sposy < e.changedTouches[0].clientY + 5) && (sposy > e.changedTouches[0].clientY - 5)
                ) {
                    return self.closeAll();
                }

                if(self.activePanel && self.activePanel.position == Panel.POSITION_TOP) {
                    if((100 - self.activePanel.y) < self.panelThreshold) {
                        self.activePanel.open();
                    } else {
                        self.activePanel.close();
                    }
                }

                if(self.activePanel && self.activePanel.position == Panel.POSITION_BOTTOM) {
                    if(self.activePanel.y < self.panelThreshold) {
                        self.activePanel.open();
                    } else {
                        self.activePanel.close();
                    }
                }

                if(self.activePanel && self.activePanel.position == Panel.POSITION_LEFT) {
                    if((100 - self.activePanel.x) < self.panelThreshold) {
                        self.activePanel.open();
                    } else {
                        self.activePanel.close();
                    }
                }

                if(self.activePanel && self.activePanel.position == Panel.POSITION_RIGHT) {
                    if(self.activePanel.x < self.panelThreshold) {
                        self.activePanel.open();
                    } else {
                        self.activePanel.close();
                    }
                }
            });
        }
    },
    initContentCMD: function() {
        var self = this;
        if(!this.contentCMD) {
            this.contentCMD = new CMD(this.contentElement, {threshold: self.moveThreshold});
            this.contentCMD.on('touchstart', function(e) {
                self.panelsAnimateOff();
            });
        }
    },
    isException: function(target) {
        var self = this,
            el = self.exceptions.length;
        if(el === 0) return false;
        for(var i = 0; i < el; i++) {
//            console.log(target, self.exceptions[i]);
            if(Help.closest(target, self.exceptions[i]) || target == document.querySelector(self.exceptions[i])) {
                return true;
            }
        }
        return false;
    },
    listenRightSwipe: function() {
        var self = this,
            sx = null,
            touchedOnContent = false;

        self.contentCMD.on('touchstart', function (e) {
            self._startTarget = e.target;
            if(self.isException(self._startTarget)) return;
            sx = Help.calculatePercentageX(e.touches[0].clientX);
            touchedOnContent = Help.closest(e.target, '.bugless-panel') == null && e.target != document.querySelector('.bugless-panel');
        });

        self.contentCMD.on('moveright', function (e) {
            if(self.isException(self._startTarget)) return;
            if(e.direction !== false && touchedOnContent) {
                if(self.leftPanel.onShow && !self.leftPanel.onShowWasCalled) {
                    self.leftPanel.onShow(self.leftPanel);
                    self.leftPanel.onShowWasCalled = true;
                }
                self.leftPanel.show();

                var cursorPos = Help.calculatePercentageX(e.touches[0].clientX); //%
                if(self.leftPanel.maxWidth !== null && sx > self.leftPanel.width) {
                    cursorPos = cursorPos - sx;
                }
                var x = cursorPos * 100 / self.leftPanel.width;
                self.leftPanel.moveX(x);
            }
        });

        self.contentCMD.on('moveendright', function(e) {
            if(self.isException(self._startTarget)) return;
            var x = self.leftPanel.x * 100 / self.leftPanel.width;
            if(x > self.panelThreshold) {
                self.leftPanel.open();
            } else {
                self.leftPanel.close();
            }
            self.leftPanel.onShowWasCalled = false;
            touchedOnContent = false;
        });
    },
    listenLeftSwipe: function() {
        var self = this,
            sx = null,
            touchedOnContent = false;

        self.contentCMD.on('touchstart', function (e) {
            self._startTarget = e.target;
            if(self.isException(self._startTarget)) return;
            sx = Help.calculatePercentageX(Help.screenWidth() - e.touches[0].clientX);
            touchedOnContent = Help.closest(e.target, '.bugless-panel') == null && e.target != document.querySelector('.bugless-panel');
        });

        self.contentCMD.on('moveleft', function (e) {
            if(self.isException(self._startTarget)) return;
            if(e.direction !== false && touchedOnContent) {
                if(self.rightPanel.onShow && !self.rightPanel.onShowWasCalled) {
                    self.rightPanel.onShow(self.rightPanel);
                    self.rightPanel.onShowWasCalled = true;
                }
                self.rightPanel.show();

                var cursorPos = Help.calculatePercentageX(e.touches[0].clientX); //%
                if(self.rightPanel.maxWidth !== null && sx > self.rightPanel.width) {
                    cursorPos = cursorPos + sx;
                }

                var x = cursorPos * 100 / self.rightPanel.width;
                self.rightPanel.moveX(x - ((100 - self.rightPanel.width) * 100 / self.rightPanel.width));
            }
        });

        self.contentCMD.on('moveendleft', function(e) {
            if(self.isException(self._startTarget)) return;
            if(self.rightPanel.x < 100 - self.panelThreshold) {
                self.rightPanel.open();
            } else {
                self.rightPanel.close();
            }
            self.rightPanel.onShowWasCalled = false;
            touchedOnContent = false;
        });
    },
    getAnimationTime: function() {
        var t = 0;
        try {
            t = parseFloat(getComputedStyle(document.querySelector('.animate'))['transitionDuration']) * 1000;
        } catch(e) {
            t = 200;
        }
        return t;
    },
    panelsAnimateOff: function() {
        for(var i in this.panels) {
            this.panels[i].animateOff();
        }
    },
    closeAll: function() {
        for(var i in this.panels) {
            if(this.panels[i].isOpened) {
                this.panels[i].close();
            }
        }
    },
    backdropOn: function() {
        Help.addClass(this.backdrop, 'in');
    },
    backdropOff: function() {
        Help.removeClass(this.backdrop, 'in');
    }
}
