<template>
  <div id="olmap" ref="olmap" style="width: 100%; height: 100%">
    <el-select
      class="mapselect"
      v-model="mapValue"
      placeholder="切换地图底图"
      @change="changeBaseMap(mapValue)"
    >
      <el-option-group
        v-for="group in options"
        :key="group.label"
        :label="group.label"
      >
        <el-option
          v-for="item in group.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-option-group>
    </el-select>
    <!-- <LayerMenu
      class="maplayermenu"
      ref="layerstatus"
      @LayerStatus="LayerStatus"
    /> -->
    <button @click="exportVectorLayer" class="mapLabel"></button>
  </div>
</template>

<script setup lang='ts'>
import { createApp, ref, onMounted, toRaw } from "vue"
import Map from "ol/Map"
import View from "ol/View"
import TileLayer from "ol/layer/Tile"
import { transform } from "ol/proj"
import mapMoudle from "./modules/maplist.ts"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import { Draw } from "ol/interaction"
import GeoJSON from "ol/format/GeoJSON"

const map = ref(null)
const popup = ref(null)
let mapLayer = ref(null)
const mapLayerlabel = ref(null)
const mapValue = ref("tdtwx")
const proj = "EPSG:4326"
const proj_m = "EPSG:3857"
const mapSources = mapMoudle.maplist
const findMap = mapMoudle.findMap
const findLabel = mapMoudle.findLabel
const options = mapSources.basemapLabel
const label = mapMoudle.Label
let vectorSource = ref(null)
const initMap = async () => {
  map.value = new Map({
    target: "olmap", // 组件模板中地图容器的 ID
    view: new View({
      center: transform([117.1805, 34.2666], proj, proj_m),
      zoom: 15,
    }),
  })
  mapLayer.value = new TileLayer({
    source: mapSources.tdtwx,
    projection: proj,
  })
  mapLayerlabel.value = new TileLayer({
    source: label.tdtwx,
    projection: proj,
  })
  map.value.addLayer(mapLayer.value)
  map.value.addLayer(mapLayerlabel.value)

  // 创建矢量图层用于显示绘制的几何图形
  vectorSource.value = new VectorSource()
  const vectorLayer = new VectorLayer({
    source: vectorSource.value,
  })
  map.value.addLayer(vectorLayer)

  // 添加绘制交互
  const drawInteraction = new Draw({
    source: vectorSource.value,
    type: "Polygon", // 根据需要更改为 'Point', 'LineString', 'Polygon'
  })
  map.value.addInteraction(drawInteraction)
}
// function closePopup() {
//   popup.value.setPosition(undefined)
// }
onMounted(() => {
  initMap()
})
const changeBaseMap = (value: string) => {
  // console.log(value)
  // mapLayer.value = null
  // map.value.removeLayer(mapLayer)
  if (mapLayer.value) {
    map.value.removeLayer(mapLayer.value)
    map.value.removeLayer(mapLayerlabel.value)
  }
  const mapValue = findMap(value)
  mapLayer.value = new TileLayer({
    source: mapValue,
    projection: proj,
  })
  map.value.addLayer(mapLayer.value)
  // this.map.addLayer(this.mapLayerlabel)
  // map.value.removeLayer(mapLayerlabel)
}
// 导出矢量图层的功能
const exportVectorLayer = () => {
  // 创建一个GeoJSON格式的实例用于导出
  const format = new GeoJSON()
  // 从矢量源中获取所有要素，并将它们转换为GeoJSON格式的字符串
  const data = format.writeFeatures(vectorSource.value.getFeatures(), {
    dataProjection: "EPSG:4326", // 目标投影
    featureProjection: map.value.getView().getProjection(), // 当前地图投影
  })

  // 创建一个用于下载的blob对象
  const blob = new Blob([data], { type: "application/json" })

  // 创建一个下载链接
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = "exported_features.geojson"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
#olmap {
  position: relative;
  z-index: 1;
}
.mapselect {
  position: absolute;
  top: 3%;
  right: 2%;
  z-index: 2;
  width: 200px;
}
.mapLabel {
  position: absolute;
  top: 8%;
  right: 3%;
  z-index: 2;
}
.mapPOI {
  position: absolute;
  top: 13%;
  right: 3%;
  z-index: 2;
}
.info {
  color: #333;
  font-family: "Microsoft YaHei";
}
.info p {
  margin-top: 10px; /* 设置上边距 */
  margin-bottom: 10px; /* 设置下边距 */
}
.scaled-image {
  width: 100px; /* 或你希望的宽度 */
  height: auto; /* 保持图像的纵横比 */
}
#popup-content {
  color: #fefefe;
  font-size: 13px;
  font-family: "Microsoft YaHei";
}
</style>
