import poi from '@/assets/poi.png';
import coordtransform from 'coordtransform';
import getFitView from 'ironknt-fitview';
import { addWtfs, addBasic, addTerr, } from './cesTool';

export function init3d (key) {
  
  // cesium 初始化
  const viewer = new Cesium.Map(key, {
      shouldAnimate: true,
      selectionIndicator: true,
      fullScreenButton: true,
  });

  viewer._cesiumWidget._creditContainer.style.display = "none";
  
  // 叠加影像服务
  // 叠加国界服务
  addBasic(viewer);
  
  // 叠加地形服务
  // addTerr(viewer);
  
  // 叠加三维地名服务
  addWtfs(viewer);
  
  // 将三维球定位到中国
  viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 17850000),
      orientation: {
          heading :  Cesium.Math.toRadians(348.4202942851978),
          pitch : Cesium.Math.toRadians(-89.74026687972041),
          roll : Cesium.Math.toRadians(0)
      },
      complete:function callback() {
          // 定位完成之后的回调函数
      }
  });
  // doCircle(viewer);
  return viewer;   
}

export const draw3dPoints = (mapV, points, callback, isFirst = 0) => {
  const list = [];
  const arr = [];
  points.forEach(e => {
    const res = coordtransform.gcj02towgs84(e?.position?.lon, e?.position?.lat,);
    list.push({
      id: e?.id,
      name: e?.businessId,
      pos: res,
      position: Cesium.Cartesian3.fromDegrees(
        ...res,
        0,
      ),
      extraInfo: { ...e },
    });
    arr.push({
      position: {
        lon: res[0],
        lat: res[1],
      },
    });
  });
  addEntities(mapV, list, callback);
  // doCircle(mapV);
  setTimeout(() => {
    // 获取中心点、设置中心点
    const centerCircle = getFitView(arr);
    flyTo(mapV, centerCircle.center);
  }, 1000 * isFirst);
};

export const flyTo = (mapV, position) => {
  mapV.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(position[0], position[1], 100000),
    complete:function callback() {
      // 定位完成之后的回调函数
    },
    duration: 4,
  });
  // mapV.camera.lookAt(
  //   Cesium.Cartesian3.fromDegrees(position[0], position[1], 17850000),
  // );
  // mapV.camera.zoomOut(20);
};

export const addEntities = (viewer, list, callback) => {
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction((movement) => {
    const pickedPrimitive = viewer.scene.pick(movement.position);
    const pickedEntity = (Cesium.defined(pickedPrimitive)) ? pickedPrimitive.id : undefined;
    if (Cesium.defined(pickedEntity) && Cesium.defined(pickedEntity.billboard)) {
      console.log(2, pickedEntity?.extraInfo);
      callback(pickedEntity?.extraInfo);
      pickedEntity.billboard.scale = 2.0;
      pickedEntity.billboard.color = Cesium.Color.ORANGERED;
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  viewer.entities.removeAll();
  list.forEach(ele => {
    viewer.entities.add({
      ...ele,
      billboard: {
        image: poi,
        width: 19,
        height: 19,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      },
    });
  });
};

export const doCircle = (viewer) => {
  let i = Date.now();

  function rotate() {
    let a = .1;
    let t = Date.now();
    let n = (t - i) / 1e3;
    i = t;
    viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, a * n);
  }

  
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 22850000),
    complete:function callback() {
      viewer.clock.onTick.addEventListener(rotate);
    }
  });
  // setTimeout(function() {
  //   viewer.clock.onTick.removeEventListener(rotate);
  // }, 15000);
};
