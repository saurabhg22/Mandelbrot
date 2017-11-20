let MAX_ITERATIONS = 1000;
let top_x = -2;
let top_y = -2;
let m_top_x = 0;
let m_top_y = 0;
let size = 4;
let m_size = 600;
let rSlider, gSlider, bSlider;
let redFactor = 0, greenFactor = 1, blueFactor = 1;
let dragging = false;
let width = 600, height = 600;
let colorGrid, iterGrid;
let i = 0;
let copied = "";

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}