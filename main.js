p5.disableFriendlyErrors = true;

function preload(){
    colorGrid = new Array(height);
    iterGrid = new Array(height);
    for(let i = 0; i < height; i++){
        colorGrid[i] = new Array(width);
        iterGrid[i] = new Array(width);
    }
}


function maximum(){
    let mx = arguments[0];
    for(let i = 1; i < arguments.length; i++){
        if(mx < arguments[i])
            mx = arguments[i];
    }
    return mx;
}


let zoom = new Zoom(top_x, top_y, size);


function setup(){
    createCanvas(width+500, height+30);
    rSlider = createSlider(0, 255, 0);
    rSlider.position(width + 30, 20);
    gSlider = createSlider(0, 255, 255);
    gSlider.position(width + 30, 50);
    bSlider = createSlider(0, 255, 255);
    bSlider.position(width + 30, 80);
    buttonRefresh = createButton('Refresh');
    buttonRefresh.position(width + 30, 210);
    buttonRefresh.mousePressed(makeMandelbrot);


    buttonReset = createButton('Reset');
    buttonReset.position(width + 30, 240);
    buttonReset.mousePressed(reset);


    buttonShare = createButton('Copy Sharable Link for current view');
    buttonShare.position(width + 30, 270);
    buttonShare.mousePressed(share);
    


    redFactor = rSlider.value()/256;
    greenFactor = gSlider.value()/256;
    blueFactor = bSlider.value()/256;
    fill(0);
    reset();
}

function draw(){
    noStroke();
    fill(255);
    rect(width, 0, 500, height);
    rect(0, height, width+500, 30);
    textSize(15);
    noStroke();
    fill(200, 0, 0);
    text("Red: " + rSlider.value(), width + 160, 30);
    fill(0, 200, 0);
    text("Green: " + gSlider.value(), width + 160, 60);
    fill(0, 0, 200);
    text("Blue: " + bSlider.value(), width + 160, 90);
    
    fill(0);
    text("Zoom: " + Math.round(4.0/zoom.size), width + 20, 150);
    text("C: (" + (zoom.top_x + zoom.size/2) + " + " + (zoom.top_y + zoom.size/2) + "i)", width + 20, 180);
    text(copied, width + 20, 300, 460, 90);
    text("By: Saurabh Gupta", 15, height+15, 460, 90);
    fill(200, 0, 0);
    text("Select the area with mouse to zoom in.", width + 20, 450, 460, 90);
    textSize(55);
    fill(0);
    text("MANDELBROT", width + 20, 350, 460, 90);

    redFactor = rSlider.value()/256;
    greenFactor = gSlider.value()/256;
    blueFactor = bSlider.value()/256;
    if(i == height){
        i = 0;
    }
    for(let j = 0; j < width; j++){
        stroke(colorGrid[i][j][0], colorGrid[i][j][1], colorGrid[i][j][2]);
        point(j, i);
    }
    i++;
}
function reset(){
    copied = "";
    background(255);
    top_x = Number(getParameterByName("x") || -2);
    if(getParameterByName("x") === "0"){
        top_x = 0;
    }
    top_y = Number(getParameterByName("y") || -2);
    if(getParameterByName("y") === "0"){
        top_y = 0;
    }
    m_top_x = 0;
    m_top_y = 0;
    size = Number(getParameterByName("s") || 4);
    m_size = 600;
    rSlider.value(Math.floor(Number(getParameterByName("r")*256 || 0)));
    if(getParameterByName("r") === "0"){
        rSlider.value(0);
    }
    gSlider.value(Math.floor(Number(getParameterByName("g")*256 || 255)));
    if(getParameterByName("g") === "0"){
        gSlider.value(0);
    }
    bSlider.value(Math.floor(Number(getParameterByName("b")*256 || 255)));
    if(getParameterByName("b") === "0"){
        bSlider.value(0);
    }
    zoom = new Zoom(top_x, top_y, size);
    i = 0;
    redFactor = rSlider.value()/256;
    greenFactor = gSlider.value()/256;
    blueFactor = bSlider.value()/256;
    makeMandelbrot();
}
function mouseDragged(){
    if(mouseX <= 0 || mouseX >= width || mouseY <= 0 || mouseY >= height) return;

    if(!dragging){
        m_top_x = mouseX;
        m_top_y = mouseY;
        dragging = true;
    }
    else{
        let tmp = m_size;
        m_size = maximum(mouseX - m_top_x, mouseY - m_top_y);
        if(m_size > tmp){
            stroke(255, 0, 0);
            fill(100, 100, 100);
            rect(m_top_x, m_top_y, m_size, m_size);
        }
    }
}

function mouseReleased(){
    if(mouseX <= 0 || mouseX >= width || mouseY <= 0 || mouseY >= height) return;
    i=0;
    dragging = false;
    top_x = top_x + m_top_x * zoom.size / width;
    top_y = top_y + m_top_y * zoom.size / height;
    size = m_size * zoom.size / width;
    zoom = new Zoom(top_x, top_y, size);
    makeMandelbrot();
}


function createHash(){
    let hash = "";
    hash += "x=" + top_x + "&";
    hash += "y=" + top_y + "&";
    hash += "s=" + zoom.size + "&";
    hash += "r=" + redFactor + "&";
    hash += "g=" + greenFactor + "&";
    hash += "b=" + blueFactor;
    return hash;
}

function share(){
    let hash = createHash();
    let url = window.location.href;
    let domain = "";
    for(let i = 0; i < url.length; i++){
        if (url[i] == '?'){
            break;
        }
        domain += url[i];
    }
    document.querySelector('.js-copytextarea').innerHTML = domain + "?" + hash;



    let copyTextarea = document.querySelector('.js-copytextarea');
    copyTextarea.select();

    try {
        let successful = document.execCommand('copy');
        let msg = successful ? 'successful' : 'unsuccessful';
        copied = "Link is Successfuly copied";

    } catch (err) {
        copied = "Oops, unable to copy";
    }
}