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
    <el-switch
      v-show="isShowLabel"
      v-model="isLabel"
      @change="changeLabel(isLabel)"
      class="mapLabel"
      inline-prompt
      active-text="显示注记"
      inactive-text="隐藏注记"
    />
  </div>
</template>

<script setup lang='ts'>
import { createApp, ref, onMounted } from "vue"
import Map from "ol/Map"
import View from "ol/View"
import TileLayer from "ol/layer/Tile"
import OSM from "ol/source/OSM"
import { transform } from "ol/proj"
import XYZ from "ol/source/XYZ"
import mapMoudle from "./modules/maplist.ts"
const map = ref(null)
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
const initMap = () => {
  map.value = new Map({
    target: "olmap", // 组件模板中地图容器的 ID
    view: new View({
      center: transform([117.1805, 34.2666], proj, proj_m),
      zoom: 11,
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
