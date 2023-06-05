let camera = null;
let renderer = null;
let scene = null;
let meshes = [];

export const initPoints = (map, arr) => {
  // 数据转换工具
  const customCoords = map.customCoords;
  // 数据使用转换工具进行转换，这个操作必须要提前执行（在获取镜头参数 函数之前执行），否则将会获得一个错误信息。
  const data = customCoords.lngLatsToCoords([
    ...arr,
  ]);
  // 创建 GL 图层
  const gllayer = new AMap.GLCustomLayer({
    // 图层的层级
    zIndex: 10,
    // 初始化的操作，创建图层过程中执行一次。
    init: (gl) => {
      // 这里我们的地图模式是 3D，所以创建一个透视相机，相机的参数初始化可以随意设置，因为在 render 函数中，每一帧都需要同步相机参数，因此这里变得不那么重要。
      // 如果你需要 2D 地图（viewMode: '2D'），那么你需要创建一个正交相机
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 100, 1 << 30);
      
      renderer = new THREE.WebGLRenderer({
        context: gl,  // 地图的 gl 上下文
        // alpha: true,
        // antialias: true,
        // canvas: gl.canvas,
      });
      
      // 自动清空画布这里必须设置为 false，否则地图底图将无法显示
      renderer.autoClear = false;
      scene = new THREE.Scene();
      
      // 环境光照和平行光
      const aLight = new THREE.AmbientLight(0xffffff, 0.3); 
      const dLight = new THREE.DirectionalLight(0xffffff, 1);
      dLight.position.set(1000, -100, 900);
      scene.add(dLight);
      scene.add(aLight);

      // const texture = new THREE.TextureLoader().load('/mat.png');
      // texture.minFilter = THREE.LinearFilter;
      //  这里可以使用 three 的各种材质
      const mat = new THREE.MeshNormalMaterial({
        color: 0xfff0f0,
        depthTest: true,
        transparent: true,
        // map: texture,
      });
      const geo = new THREE.OctahedronGeometry(12,);
      for (let i = 0; i < data.length; i++) {
        const d = data[i];
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(d[0], d[1], 0);
        meshes.push({
          mesh,
          count: i,
        });
        scene.add(mesh);
      }
    },
    render: () => {
      // 这里必须执行！！重新设置 three 的 gl 上下文状态。
      renderer.resetState();
      // 重新设置图层的渲染中心点，将模型等物体的渲染中心点重置
      // 否则和 LOCA 可视化等多个图层能力使用的时候会出现物体位置偏移的问题
      customCoords.setCenter([111.68, 29.03]);
      const { near, far, fov, up, lookAt, position } = customCoords.getCameraParams();
      
      // 2D 地图下使用的正交相机
      // const { near, far, top, bottom, left, right, position, rotation } = customCoords.getCameraParams();

      // 这里的顺序不能颠倒，否则可能会出现绘制卡顿的效果。
      camera.near = near;
      camera.far = far;
      camera.fov = fov;
      camera.position.set(...position);
      camera.up.set(...up);
      camera.lookAt(...lookAt);
      camera.updateProjectionMatrix();

      // 2D 地图使用的正交相机参数赋值
      // camera.top = top;
      // camera.bottom = bottom;
      // camera.left = left;
      // camera.right = right;
      // camera.position.set(...position);
      // camera.updateProjectionMatrix();
      
      renderer.render(scene, camera);
    
      // 这里必须执行！！重新设置 three 的 gl 上下文状态。
      renderer.resetState();
    },
  });

  map.add(gllayer);
  doCircle(map);
};
  
const doCircle = (map) => {
  // 动画
  function animate() {
    for (let i = 0; i < meshes.length; i++) {
        let { mesh, count } = meshes[i];
        count += 1;
        mesh.rotateZ(count / 270 * Math.PI);
    }
    map.render();
    requestAnimationFrame(animate);
  }
  animate();

  function onWindowResize() { 
    camera.aspect = window.innerWidth / window.innerHeight; 
    camera.updateProjectionMatrix(); 
    renderer.setSize(window.innerWidth, window.innerHeight); 
  }
  window.addEventListener('resize', onWindowResize);
};
