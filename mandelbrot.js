
function getIterations(x, y){
    let z = new Complex(0.0, 0.0), c = new Complex(x, y), i;

    for(i = 0; i < MAX_ITERATIONS; i++){
        z = (z.mult(z)).add(c)
        if(z.abs() >= 2){
            break;
        }
    }
    return i;
}


function makeMandelbrot(colorGrid, img, previmg, zoom, Color){
    copied  = "";
    try{
        for(let h = 0; h < height; h++){
            for(let w = 0; w < width; w++){
                previmg.set(w, h, Color(colorGrid[h][w][0], colorGrid[h][w][1], colorGrid[h][w][2]));
            }
        }
        previmg.updatePixels();
    }
    catch(e){}


    working = true;
    copied = "";
    let done = 0, color;
    histogram = Array(MAX_ITERATIONS);
    for(let iter = 0; iter < MAX_ITERATIONS; iter++){
        histogram[iter] = 0;
    }
    for(let h = 0; h < height; h++){
        for(let w = 0; w < width; w++){
            let x = zoom.getX(w), y = zoom.getY(h);
            let iterations = getIterations(x, y);
            if(iterations < MAX_ITERATIONS) histogram[iterations]++;
            iterGrid[h][w] = iterations;
        }
    }

    for(let iter = 1; iter < MAX_ITERATIONS; iter++){
        histogram[iter] += histogram[iter-1];
    }
    let clr;
    for(let h = 0; h < height; h++){
        for(let w = 0; w < width; w++){
            let iter = iterGrid[h][w];
            if(iter < MAX_ITERATIONS){
                clr = Math.pow((histogram[iterGrid[h][w]] / (histogram[MAX_ITERATIONS-1])), 2) * 256;
                colorGrid[h][w] = [redFactor*clr, greenFactor*clr, blueFactor*clr];
            }
            else{
                colorGrid[h][w] = [0, 0, 0];
            }
            
            img.set(w, h, Color(colorGrid[h][w][0], colorGrid[h][w][1], colorGrid[h][w][2]));
        }
    }
    img.updatePixels();
}
   



function reset(){
    mousePressed();
    working = true;
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
    
    makeMandelbrot(colorGrid, img, previmg, zoom, Color);
    working = false;
    document.getElementById("loading").style.display =  "none";
}

function refresh(){
    copied = "";
    try{
        for(let h = 0; h < height; h++){
            for(let w = 0; w < width; w++){
                let iter = iterGrid[h][w];
                if(iter < MAX_ITERATIONS){
                    clr = Math.pow((histogram[iterGrid[h][w]] / (histogram[MAX_ITERATIONS-1])), 2) * 256;
                    colorGrid[h][w] = [redFactor*clr, greenFactor*clr, blueFactor*clr];
                }
                else{
                    colorGrid[h][w] = [0, 0, 0];
                }
                
                img.set(w, h, Color(colorGrid[h][w][0], colorGrid[h][w][1], colorGrid[h][w][2]));
                previmg.set(w, h, Color(colorGrid[h][w][0], colorGrid[h][w][1], colorGrid[h][w][2]));
            }
        }
        img.updatePixels();
        prev.updatePixels();
    }
    catch(e){}
    document.getElementById("loading").style.display =  "none";
}