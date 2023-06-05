import { AVATAR_NOIMAGE } from '../variables';

async function createImage(src) {
  return new Promise((resolve,) => {
    const icon = new Image();
    icon.src = src;
    icon.onload = () => {
      resolve(icon);
    };
    icon.onerror = (err) => {
      // reject(err);
      const ic = new Image();
      ic.src = AVATAR_NOIMAGE;
      resolve(ic);
    };
  });
}

async function preParePicture (rs) {
  const arr = [];
  for (let i = 0; i < rs.length; i++) {
    arr.push(createImage(rs[i].avatar));
  }
  const res = await Promise.all(arr);
  for (let i = 0; i < rs.length; i++) {
    rs[i].img = res[i];
  }
}

export const AvatarOverlay = T.Overlay.extend({
  initialize: function (options) {
    this.config = options;
    this.customLayer = null;
    this.map = null;
    this.draw = null;
    this.clickHandler = null;
  },

  getContainerPoint: function (latlng) {
    const currentBounds = this.map.getBounds();
    const divPixel = this.map.lngLatToLayerPoint(latlng),
        leftX = this.map.lngLatToLayerPoint(currentBounds.getSouthWest()).x,
        topY = this.map.lngLatToLayerPoint(currentBounds.getNorthEast()).y,
        screenPixel = new T.Point(divPixel.x - leftX, divPixel.y - topY);
    if (divPixel.x - leftX < 0 || divPixel.y - topY < 0) return { x: -1, y: -1, };
    return screenPixel;
  },

  getSize () {
    const currentBounds = this.map.getBounds();
    const ne = this.map.lngLatToLayerPoint(currentBounds.getNorthEast()),
        sw = this.map.lngLatToLayerPoint(currentBounds.getSouthWest()),
        topY = ne.y,
        leftX = sw.x,
        h = sw.y - ne.y,
        w = ne.x - sw.x;
    return { topY, leftX, x: w, y: h, };
  },

  onAdd: async function (map) {
    const { data, callback, } = this.config;
    this.map = map;
    const canvas = document.createElement('canvas');
    this.data = data;
    this.callback = callback;
    this.customLayer = canvas;
    const onRender = () => {
      this.drawPilot();
    }
    onRender();
    this.draw = onRender;
    map.getPanes().overlayPane.appendChild(this.customLayer);
    map.on('moveend', onRender);
    this.onClick = (e) => {
      const layerPoint = e?.containerPoint;
      if (!layerPoint) return;
      let point = null, minDis = -1;
      for (const item of this.data) {
        const { drawPoint } = item;
        if (!drawPoint) continue;
        const dis = this.caculateDistance(drawPoint, layerPoint);
        if (dis < minDis || minDis === -1) {
          point = {...item};
          minDis = dis;
        }
      }
      if (!point || minDis > 50) return;
      this.callback(point);
    }
    map.on('click', this.onClick);
  },

  onRemove: function (map) {
    map.getPanes().overlayPane.removeChild(this.customLayer);
    map.off('moveend', this.draw);
    map.off('click', this.onClick);
  },

  caculateDistance (px, py) {
    let tempX = px.x - py.x;
    tempX = tempX > 0 ? tempX : -tempX;
    let tempY = px.y - py.y;
    tempY = tempY > 0 ? tempY : -tempY;
    return tempX + tempY;
  },

  drawPic (img, ctx, px, r) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(px.x - r, px.y);
    ctx.arc(px.x, px.y, r, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(img, px.x - r, px.y - r, 2 * r, 2 * r);
    ctx.fill();
    ctx.restore();
  },

  drawPilot () {
    const rs = [...this.data];
    const canvas = this.customLayer;
    const size = this.getSize();
    const { x: width, y: height, topY, leftX, } = size;
    const [ BW, BH ] = [ width, height ];

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, BW, BH);

    const devicePixelRatio = window.devicePixelRatio || 1;
    const backingStoreRatio = ctx.webkitBackingStorePixelRatio || 1;
    const ratio = devicePixelRatio / backingStoreRatio;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    //然后将画布缩放，将图像放大两倍画到画布上
    ctx.scale(ratio, ratio);

    this.customLayer.style[this.CSS_TRANSFORM()] = 'translate(' + Math.round(leftX) + 'px,' + Math.round(topY) + 'px)';

    // ctx.globalCompositeOperation = 'lighter';
    ctx.globalCompositeOperation = 'destination-atop';
    for (let i = 0, len = rs.length; i < len; i++) {
      const { position } = rs[i];
      // eslint-disable-next-line
      if (!position || !position?.lon || !position?.lat) continue;
      const px = this.getContainerPoint({
        lng: position?.lon,
        lat: position?.lat,
      });
      const r = rs[i].size / 2;
      rs[i].drawPoint = px;
      if (px.x < 0 || px.x > BW + 200 || px.y < 0 || px.y > BH + 200) continue;
      if (rs[i].img) {
        this.drawPic(rs[i].img, ctx, px, r);
        continue;
      }
      const img = new Image();
      img.src = rs[i].avatar;
      img.onload = () => {
        rs[i].img = img;
        this.drawPic(img, ctx, px, r);
      }
    }
  },

  CSS_TRANSFORM: function () {
    const div = document.createElement('div');
    const props = [
      'transform',
      'WebkitTransform',
      'MozTransform',
      'OTransform',
      'msTransform',
    ];
    for (let i = 0; i < props.length; i++) {
      const prop = props[i];
      if (div.style[prop] !== undefined) {
        return prop;
      }
    }
    return props[0];
  },
});

export default {
  AvatarOverlay,
};
