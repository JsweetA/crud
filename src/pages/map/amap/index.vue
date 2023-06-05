<template>
  <div class="container" id="amap">
  </div>
</template>

<script setup name="amap">
  import { onMounted, } from 'vue';
  import { initPoints, } from './tool';

  let map = null;
  const areas = [];
  const buildingLayer = new AMap.Buildings({ zIndex:130, zooms:[10,20] });

  onMounted(() => {
    map = new AMap.Map('amap', {
      zoom: 17,
      pitch: 50,
      showBuildingBlock: true,
      showIndoorMap: false,
      showLabel: false,
      mapStyle: 'amap://styles/light',
      center: [111.69, 29.03],
      features: ['bg', 'point', 'road'],
      viewMode: '3D',
      layers:[
        AMap.createDefaultLayer(),
        buildingLayer,
      ],
    });

    let arr = Array.from(Array(100).keys(), n => n + 1);
    arr = arr.map(n => [111.68 + n * 0.001, 29.23 + n * 0.001]);
    const list = arr.map(n => {
      return {
        position: {
          lon: n[0],
          lat: n[1],
        },
      };
    });

    initPoints(map, arr);
    
    
    const mouseTool = new AMap.MouseTool(map);

    mouseTool.on('draw', (e) => {
      const path = e?.obj?.getPath().map(ele => [ele.lng, ele.lat]);
      areas.push({
        color1: 'ff99ff00',
        color2: 'ff999900',
        path,
      });
      const options = {
        hideWithoutStyle: false,
        areas,
      };
      buildingLayer.setStyle(options);
      map.remove(e?.obj);
    });
    mouseTool.polygon({
      fillColor: '#00b0ff',
      strokeColor: '#80d8ff'
    });
  });
</script>

<style scoped lang="scss">
  .container {
    width: 100%;
    height: 100%;
  }
</style>
