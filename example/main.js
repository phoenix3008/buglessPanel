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
    width: 80,
    height: 30,
});

BuglessPanels.init({
    content: '.container',
    leftPanel: leftPanel,
    rightPanel: rightPanel,
    panelThreshold: 30,
<<<<<<< HEAD
    exceptions: ['#exception1', '#exception2', '.no-bp-trigger']
=======
    exceptions: ['#exception1', '#exception2']
>>>>>>> af241596ac8ec56dec5848ab2cbac3778f87233c
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



