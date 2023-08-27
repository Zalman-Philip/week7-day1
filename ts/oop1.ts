class Shape {
  constructor() {}
  info() {
    return "This is a Shape";
  }
  draw() {
    console.log('drawing a shape');
  }
}

class Rectangle extends Shape {
  hight: number;
  width: number;
  constructor(hight: number, width: number) {
    super();
    this.hight = hight;
    this.width = width;
  }
  draw(): void {
      console.log('drawing a rectangle');
      
  }
  area() {
    return (this.hight * this.width);
  }
  info() {
    return "This is a Rectangle";
  }
  scale(num: number) {
    this.hight += num;
    this.width += num;
    return this;
  }
  static towRectangles (rec1: Rectangle, rec2: Rectangle):Rectangle {
    let hight = rec1.hight + rec2.hight;
    let width = rec1.width + rec2.width;
    return new Rectangle(hight, width)
  }
}

class Square extends Rectangle {
  side: number;
  constructor(side: number) {
    super(side, side);
    this.side = side;
  }
  area() {
    return this.side * this.side;
  }
  draw(): void {
      console.log("drawing a square");
      
  }
}

const mySquare = new Square(3);
const s = mySquare.area();
console.log(s);

class ColoredRectangle extends Rectangle {
  color: string;
  constructor(hight: number, width: number, color: string) {
    super(hight, width);
    this.color = color;
  }
  info() {
    return `This is a ${this.color} Rectangle`;
  }
}
const rec1 = new Rectangle(3,4)
const rec2 = new Rectangle(4,6)
console.log(Rectangle.towRectangles(rec1, rec2));


class  Triangle extends Shape{
    constructor(){
        super()
    }
    draw(): void {
        console.log("drawing a triangle");
        
    }
}

class Circle extends Shape {
    constructor(){
        super()
    }
    draw(): void {
        console.log("drawing a circle");
        
    }
}


const renderShapes = (shape:Shape) => {
    shape.draw()
}