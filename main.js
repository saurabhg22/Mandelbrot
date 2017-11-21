p5.disableFriendlyErrors = true;


function maximum(){
    let mx = arguments[0];
    for(let i = 1; i < arguments.length; i++){
        if(mx < arguments[i])
            mx = arguments[i];
    }
    return mx;
}



function zoomout(){
    console.log("zooming")
    zoomingout =true;
    top_x -= 3*size/2;
    top_y -=  3*size/2;
    size *= 4;
    m_top_x -= 3*m_size/2;
    m_top_y -= 3*m_size/2;
    m_size *= 4;
    zoom = new Zoom(top_x, top_y, size);
    makeMandelbrot(colorGrid, img, previmg, zoom, Color);
    document.getElementById("loading").style.display = "hidden";
}

function setup(){
    
document.getElementById("loading").style.display =  "hidden";
    Color = color;
    createCanvas(width+500, height+30);
    img = createGraphics(width, height);
    previmg = createGraphics(width, height);
    img.loadPixels();
    previmg.loadPixels();
    rSlider = createSlider(0, 255, 0);
    rSlider.position(width + 30, 20);
    gSlider = createSlider(0, 255, 255);
    gSlider.position(width + 30, 50);
    bSlider = createSlider(0, 255, 255);
    bSlider.position(width + 30, 80);
    buttonZoomout = createButton('Zoom Out');
    buttonZoomout.position(width + 30, 110);
    buttonZoomout.mouseClicked(zoomout);
    buttonZoomout.mousePressed(load);


    buttonRefresh = createButton('Refresh');
    buttonRefresh.position(width + 30, 210);
    buttonRefresh.mouseClicked(refresh);
    buttonRefresh.mousePressed(load);


    buttonReset = createButton('Reset');
    buttonReset.position(width + 30, 240);
    buttonReset.mouseClicked(reset);
    buttonReset.mousePressed(load);


    buttonShare = createButton('Copy Sharable Link of current view');
    buttonShare.position(width + 30, 270);
    buttonShare.mouseClicked(share);
    


    redFactor = rSlider.value()/256;
    greenFactor = gSlider.value()/256;
    blueFactor = bSlider.value()/256;
    fill(0);
    loaded = true;
    reset();
}



let count = 0;
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
    text("Click on the area to zoom in. (Don't click multiple times in a row.)", width + 20, 450, 460, 90);
    textSize(55);
    fill(0);
    text("MANDELBROT", width + 20, 350, 460, 90);

    redFactor = rSlider.value()/256;
    greenFactor = gSlider.value()/256;
    blueFactor = bSlider.value()/256;
    if(working && count < 100){
        if(!zoomingout){
            image(previmg, 0, 0, width, height, floor(m_top_x), floor(m_top_y), floor(m_size), floor(m_size));
            count++;
            m_top_x = map(count, 0, 100, 0, tmp_m_top_x);
            m_top_y = map(count, 0, 100, 0, tmp_m_top_y);
            m_size = map(count, 0, 100, 600, tmp_m_size);
        }
        else{
            image(img, 0, 0, width, height, floor(m_top_x), floor(m_top_y), floor(m_size), floor(m_size));
            count++;
            m_top_x = map(count, 0, 100, 225, 0);
            m_top_y = map(count, 0, 100, 225, 0);
            m_size = map(count, 0, 100, 150, 600);
            
        }
    }
    else{
        count = 0;
        image(img, 0, 0, width, height);
        working = false;
        zoomingout = false;
    }


}
function load(){
    document.getElementById("loading").style.display =  "block";
}

function mousePressed(){
    if(mouseX <= 0 || mouseX >= width || mouseY <= 0 || mouseY >= height) return;
    document.getElementById("loading").style.display =  "block";

}

function mouseClicked(){
    if(mouseX <= 0 || mouseX >= width || mouseY <= 0 || mouseY >= height) return;

    m_size = 50;
    m_top_x = mouseX - m_size/2;
    m_top_y = mouseY - m_size/2;
    tmp_m_top_x = m_top_x;
    tmp_m_top_y = m_top_y;
    tmp_m_size = m_size;


    top_x = top_x + m_top_x * zoom.size / width;
    top_y = top_y + m_top_y * zoom.size / height;
    size = m_size * zoom.size / width;
    zoom = new Zoom(top_x, top_y, size);
    working = true;
    makeMandelbrot(colorGrid, img, previmg, zoom, Color);
    document.getElementById("loading").style.display =  "none";
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