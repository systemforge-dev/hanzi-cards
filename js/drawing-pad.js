// DrawingPad: turns a <canvas> into a box you can write in
// with a mouse, finger or stylus. Knows nothing about Chinese —
// it only stores strokes and draws them.

class DrawingPad {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.strokes = [];   // each stroke = list of points {x, y} from 0 to 1
    this.current = null; // the stroke being drawn right now

    canvas.addEventListener("pointerdown", (e) => this.start(e));
    canvas.addEventListener("pointermove", (e) => this.move(e));
    ["pointerup", "pointercancel"].forEach((t) =>
      canvas.addEventListener(t, () => this.end())
    );
    new ResizeObserver(() => this.resize()).observe(canvas);
    this.resize();
  }

  // Keep the drawing sharp on high-resolution screens.
  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.w = rect.width;
    this.h = rect.height;
    this.canvas.width = Math.round(rect.width * dpr);
    this.canvas.height = Math.round(rect.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.redraw();
  }

  // Points are stored as 0..1 so strokes survive a window resize.
  point(e) {
    const rect = this.canvas.getBoundingClientRect();
    return { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };
  }

  start(e) {
    e.preventDefault();
    this.canvas.setPointerCapture(e.pointerId);
    this.current = [this.point(e)];
    this.strokes.push(this.current);
    this.redraw();
  }

  move(e) {
    if (!this.current) return;
    this.current.push(this.point(e));
    this.redraw();
  }

  end() {
    this.current = null;
  }

  redraw() {
    const { ctx, w, h } = this;
    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#221c18";
    ctx.lineWidth = Math.max(6, w * 0.03);
    for (const stroke of this.strokes) {
      ctx.beginPath();
      stroke.forEach((p, i) => (i ? ctx.lineTo(p.x * w, p.y * h) : ctx.moveTo(p.x * w, p.y * h)));
      if (stroke.length === 1) ctx.lineTo(stroke[0].x * w + 0.1, stroke[0].y * h); // a dot
      ctx.stroke();
    }
  }

  undo() {
    this.strokes.pop();
    this.redraw();
  }

  clear() {
    this.strokes = [];
    this.redraw();
  }
}
