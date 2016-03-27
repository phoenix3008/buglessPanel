var leftPanel = new Panel('#left-panel', {
    position: Panel.POSITION_LEFT,
    width: 80,
    maxWidth: 400
});

BuglessPanels.init({
    content: '.bugless-content',
    leftPanel: leftPanel
});

document.querySelector('.hamburger-menu-button').addEventListener('click', function(e) {
    leftPanel.open();
});
