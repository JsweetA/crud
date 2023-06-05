const token = '6bf24d69e61b1f58f16879c77f76f40e';
// 服务域名
const tdtUrl = 'https://t{s}.tianditu.gov.cn/';
// 服务负载子域
const subdomains = ['0','1','2','3','4','5','6','7'];

export const addWtfs = (viewer) => {
  const wtfs = new Cesium.GeoWTFS({
    viewer,
    subdomains,
    metadata:{
      boundBox: {
        minX: -180,
        minY: -90,
        maxX: 180,
        maxY: 90
      },
      minLevel: 1,
      maxLevel: 20
    },
    aotuCollide: true, // 是否开启避让
    collisionPadding: [5, 10, 8, 5], // 开启避让时，标注碰撞增加内边距，上、右、下、左
    serverFirstStyle: true, // 服务端样式优先
    labelGraphics: {
      font:"28px sans-serif",
      fontSize: 28,
      fillColor:Cesium.Color.WHITE,
      scale: 0.5,
      outlineColor:Cesium.Color.BLACK,
      outlineWidth: 5,
      style:Cesium.LabelStyle.FILL_AND_OUTLINE,
      showBackground:false,
      backgroundColor:Cesium.Color.RED,
      backgroundPadding:new Cesium.Cartesian2(10, 10),
      horizontalOrigin:Cesium.HorizontalOrigin.MIDDLE,
      verticalOrigin:Cesium.VerticalOrigin.TOP,
      eyeOffset:Cesium.Cartesian3.ZERO,
      pixelOffset:new Cesium.Cartesian2(0, 8)
    },
    billboardGraphics: {
      horizontalOrigin:Cesium.HorizontalOrigin.CENTER,
      verticalOrigin:Cesium.VerticalOrigin.CENTER,
      eyeOffset:Cesium.Cartesian3.ZERO,
      pixelOffset:Cesium.Cartesian2.ZERO,
      alignedAxis:Cesium.Cartesian3.ZERO,
      color:Cesium.Color.WHITE,
      rotation:0,
      scale:1,
      width:18,
      height:18
    }
  });
  
  // 三维地名服务，使用wtfs服务
  wtfs.getTileUrl = () => {
    return `${tdtUrl}mapservice/GetTiles?lxys={z},{x},{y}&tk=${token}`; 
  };
  
  wtfs.getIcoUrl = () => {
    return `${tdtUrl}mapservice/GetIcon?id={id}&tk=${token}`;
  };
  
  // eslint-disable-next-line
  wtfs.initTDT([{"x":6,"y":1,"level":2,"boundBox":{"minX":90,"minY":0,"maxX":135,"maxY":45}},{"x":7,"y":1,"level":2,"boundBox":{"minX":135,"minY":0,"maxX":180,"maxY":45}},{"x":6,"y":0,"level":2,"boundBox":{"minX":90,"minY":45,"maxX":135,"maxY":90}},{"x":7,"y":0,"level":2,"boundBox":{"minX":135,"minY":45,"maxX":180,"maxY":90}},{"x":5,"y":1,"level":2,"boundBox":{"minX":45,"minY":0,"maxX":90,"maxY":45}},{"x":4,"y":1,"level":2,"boundBox":{"minX":0,"minY":0,"maxX":45,"maxY":45}},{"x":5,"y":0,"level":2,"boundBox":{"minX":45,"minY":45,"maxX":90,"maxY":90}},{"x":4,"y":0,"level":2,"boundBox":{"minX":0,"minY":45,"maxX":45,"maxY":90}},{"x":6,"y":2,"level":2,"boundBox":{"minX":90,"minY":-45,"maxX":135,"maxY":0}},{"x":6,"y":3,"level":2,"boundBox":{"minX":90,"minY":-90,"maxX":135,"maxY":-45}},{"x":7,"y":2,"level":2,"boundBox":{"minX":135,"minY":-45,"maxX":180,"maxY":0}},{"x":5,"y":2,"level":2,"boundBox":{"minX":45,"minY":-45,"maxX":90,"maxY":0}},{"x":4,"y":2,"level":2,"boundBox":{"minX":0,"minY":-45,"maxX":45,"maxY":0}},{"x":3,"y":1,"level":2,"boundBox":{"minX":-45,"minY":0,"maxX":0,"maxY":45}},{"x":3,"y":0,"level":2,"boundBox":{"minX":-45,"minY":45,"maxX":0,"maxY":90}},{"x":2,"y":0,"level":2,"boundBox":{"minX":-90,"minY":45,"maxX":-45,"maxY":90}},{"x":0,"y":1,"level":2,"boundBox":{"minX":-180,"minY":0,"maxX":-135,"maxY":45}},{"x":1,"y":0,"level":2,"boundBox":{"minX":-135,"minY":45,"maxX":-90,"maxY":90}},{"x":0,"y":0,"level":2,"boundBox":{"minX":-180,"minY":45,"maxX":-135,"maxY":90}}]);  
};

export const addTerr = (viewer) => {
  const terrainUrls = [];
  
  for (let i = 0; i < subdomains.length; i++){
      const url = `${tdtUrl.replace('{s}', subdomains[i])}DataServer?T=elv_c&tk=${token}`;
      terrainUrls.push(url);
  }
  
  const provider = new Cesium.GeoTerrainProvider({
      urls: terrainUrls
  });
  
  viewer.terrainProvider = provider;
};

export const addBasic = (viewer) => {
  const imgMap = new Cesium.UrlTemplateImageryProvider({
    url: `${tdtUrl}DataServer?T=img_w&x={x}&y={y}&l={z}&tk=${token}`,
    subdomains,
    tilingScheme : new Cesium.WebMercatorTilingScheme(),
    maximumLevel : 18
  });
  viewer.imageryLayers.addImageryProvider(imgMap);
  
  const iboMap = new Cesium.UrlTemplateImageryProvider({
    url: `${tdtUrl}DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=${token}`,
    subdomains,
    tilingScheme : new Cesium.WebMercatorTilingScheme(),
    maximumLevel : 10
  });
  viewer.imageryLayers.addImageryProvider(iboMap);
};