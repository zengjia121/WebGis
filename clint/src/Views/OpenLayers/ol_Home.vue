<template>
  <div id="olmap" ref="olmap" style="width: 100%; height: 100%">
    <el-select
      class="mapselect"
      v-model="value"
      placeholder="切换地图底图"
      @change="changeBaseMap(value)"
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
  </div>
</template>

<script setup lang='ts'>
import { createApp, ref, onMounted } from "vue"
import Map from "ol/Map"
import View from "ol/View"
import TileLayer from "ol/layer/Tile"
import OSM from "ol/source/OSM"
import { transform } from "ol/proj"
import mapSources from "./modules/maplist"
const map = ref(null)
const mapLayer = ref(null)
const mapLayerlabel = ref(null)
const value = ref("tdtwx")
const proj = "EPSG:4326"
const proj_m = "EPSG:3857"
const options = mapSources.basemapLabel
const initMap = () => {
  map.value = new Map({
    target: "olmap", // 组件模板中地图容器的 ID
    view: new View({
      center: transform([101.46912, 36.24274], proj, proj_m),
      zoom: 11,
    }),
  })
  mapLayer.value = new TileLayer({
    source: new OSM(),
    projection: proj,
  })
  //   // mapLayerlabel.value = new TileLayer({
  //   //   source: mapSources.tdtlabelwx,
  //   //   projection: proj,
  //   // })
  map.value.addLayer(mapLayer.value)
  //   // map.value.addLayer(mapLayerlabel.value)
}

onMounted(() => {
  initMap()
})

// const changeBaseMap = (value) => {
//   console.log(value)
//   map.value.removeLayer(mapLayer)
//   map.value.removeLayer(mapLayerlabel)
// }
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
}
</style>
