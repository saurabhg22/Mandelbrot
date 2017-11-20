
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

function makeMandelbrot(){
    copied = "";
    let done = 0, color;
    let histogram = Array(MAX_ITERATIONS);
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
                clr = Math.pow((histogram[iterGrid[h][w]] / (width*height)), 2) * 256;
                colorGrid[h][w] = [redFactor*clr, greenFactor*clr, blueFactor*clr];
            }
            else{
                colorGrid[h][w] = [0, 0, 0];
            }
            
        }
    }

}