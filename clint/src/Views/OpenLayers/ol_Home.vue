<template>
  <div id="olmap" ref="olmap" style="width: 100%; height: 100%">
    <div id="popup" class="ol-popup">
      <a
        href="#"
        id="popup-closer"
        class="ol-popup-closer"
        @click="closePopup"
      ></a>
      <div id="popup-content"></div>
    </div>
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
    <el-switch
      v-show="isShowLabel"
      v-model="isLabel"
      @change="changeLabel(isLabel)"
      class="mapLabel"
      inline-prompt
      active-text="显示注记"
      inactive-text="隐藏注记"
    />
    <!-- <LayerMenu
      class="maplayermenu"
      ref="layerstatus"
      @LayerStatus="LayerStatus"
    /> -->
  </div>
</template>

<script setup lang='ts'>
import { createApp, ref, onMounted, toRaw } from "vue"
import Map from "ol/Map"
import View from "ol/View"
import TileLayer from "ol/layer/Tile"
import { transform } from "ol/proj"
import Feature from "ol/Feature"
import mapMoudle from "./modules/maplist.ts"
import Point from "ol/geom/Point"
import { Icon, Style } from "ol/style"
import VectorSource from "ol/source/Vector"
import VectorLayer from "ol/layer/Vector"
import Overlay from "ol/Overlay"
import { Circle as CircleStyle, Fill } from "ol/style"
import axios from "axios"

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
const isShowLabel = ref(true)
const isLabel = ref(false)
let markData = null
const location = { lng: 117.1805, lat: 34.2666 }
const initMap = async () => {
  let res = await axios.get(
    `https://restapi.amap.com/v3/place/around?location=${location.lng},${location.lat}&radius=1000&types=餐饮服务&key=5e1bca9ae11b3412a0407d23ce7270e5`,
  )
  console.log(res.data)
  markData = res.data
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
  // 在循环外部创建 VectorSource 和 VectorLayer
  const vectorSource = new VectorSource()
  const vectorLayer = new VectorLayer({
    source: vectorSource,
  })

  // 遍历标记数据，为每个标记创建 Feature 并添加到 VectorSource
  markData.pois.forEach((item) => {
    const coords = item.location.split(",").map(Number) // 简化坐标解析
    const marker = new Feature({
      geometry: new Point(transform(coords, proj, proj_m)),
      properties: {
        name: item.name,
        ...item,
      },
    })

    // 启用并设置标记样式
    marker.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({
            color: "red",
          }),
        }),
      }),
    )

    vectorSource.addFeature(marker) // 将标记添加到源中
  })
  map.value.addLayer(vectorLayer)
  // 创建弹出窗口的 Overlay
  popup.value = new Overlay({
    element: document.getElementById("popup"),
    autoPan: true,
    autoPanAnimation: {
      duration: 250,
    },
  })
  map.value.addOverlay(popup.value)

  map.value.on("singleclick", function (event) {
    map.value.forEachFeatureAtPixel(event.pixel, function (feature) {
      let properties = feature.getProperties().properties
      console.log(properties)
      const coordinates = feature.getGeometry().getCoordinates()
      popup.value.setPosition(coordinates)
      document.getElementById("popup-content").innerHTML =
        properties.name || "无名称"
      return true // 停止遍历更多的 feature
    })
  })
  // 假设你的地图实例名为map
  let center = map.value.getView().getCenter()
  console.log(center[0]) // 打印中心点坐标
}
function closePopup() {
  popup.value.setPosition(undefined)
}
onMounted(() => {
  initMap()
})
const changeLabel = (isLabel: boolean) => {
  if (mapLayerlabel.value) {
    map.value.removeLayer(mapLayerlabel.value)
  }
  const mapLabel = findLabel(mapValue.value)
  if (mapLabel) {
    if (isLabel) {
      mapLayerlabel.value = new TileLayer({
        source: mapLabel,
        projection: proj,
      })
      map.value.addLayer(mapLayerlabel.value)
    }
  }
}
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
const LayerStatus = async (layer) => {
  // console.log(map.value.getCenter())
  const location = map.value.getView().getCenter()
  console.log(location)
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
</style>
