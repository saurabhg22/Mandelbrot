
function Complex(a, b){
    this.real = a;
    this.img = b;
}

Complex.prototype.add = function(z){
    return new Complex(this.real + z.real, this.img + z.img);
}
Complex.prototype.mult = function(z){
    return new Complex(this.real*z.real - this.img*z.img, this.real*z.img + this.img*z.real);
}
Complex.prototype.abs = function(z){
    return this.real*this.real + this.img*this.img;
}