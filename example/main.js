var leftPanel = new Panel('#left-panel', {
    position: Panel.POSITION_LEFT,
    width: 80,
    maxWidth: 350
});

window.leftPanel2 = new Panel('#left-panel2', {
    position: Panel.POSITION_LEFT,
    width: 80,
    maxWidth: 350
});

var rightPanel = new Panel('#right-panel', {
    position: Panel.POSITION_RIGHT,
    width: 80,
    maxWidth: 350,
});

var topPanel = new Panel('#top-panel', {
    position: Panel.POSITION_TOP,
    width: 80,
    height: 80,
});


var bottomPanel = new Panel('#bottom-panel', {
    position: Panel.POSITION_BOTTOM,
    width: 100,
    height: 100,
    //closeBySwipe: false
    exceptions: ['#exception1-bottom']
});

BuglessPanels.init({
    content: '.container',
    leftPanel: leftPanel,
    rightPanel: rightPanel,
    panelThreshold: 30,
    exceptions: ['#exception1', '#exception2', '.no-bp-trigger']
});


document.querySelector('#open-right').addEventListener('click', function() {
    rightPanel.open();
});

document.querySelector('#open-top').addEventListener('click', function() {
    topPanel.open();
});

document.querySelector('#open-bottom').addEventListener('click', function() {
    bottomPanel.open();
});



