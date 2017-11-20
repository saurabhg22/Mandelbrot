function Zoom(x, y, size){
    this.top_x = x + 0.0;
    this.top_y = y + 0.0;
    this.size = size;
}

Zoom.prototype.getX = function(w){
    return this.top_x + (w / width) * this.size;
}
Zoom.prototype.getY = function(h){
    return (this.top_y + (h / height) * this.size);
}