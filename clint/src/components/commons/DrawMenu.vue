<template>
  <div class="DrawMenu">
    <el-select
      v-model="selectType"
      @change="DrawTypeChange"
      placeholder="Select"
      size="small"
      style="margin-right: 5px"
    >
      <el-option
        v-for="item in drawType"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-upload
      v-model="fileName"
      actions="#"
      :limit="1"
      :on-change="handleChange"
      :show-file-list="false"
    >
      <el-button type="primary" size="small">Upload</el-button>
    </el-upload>
    <el-button type="primary" size="small" @click="DrawTypeChange(selectType)"
      >Start</el-button
    >
    <el-button type="primary" size="small" @click="StopVectorLayer"
      >Stop</el-button
    >

    <el-button type="primary" size="small" @click="clearVectorLayer"
      >Clear</el-button
    >
    <el-button type="primary" size="small" @click="exportVectorLayer"
      >Export</el-button
    >
  </div>
</template>
<script setup lang='ts'>
import GeoJSON from "ol/format/GeoJSON"
import VectorSource from "ol/source/Vector"
import { ref, reactive } from "vue"
const emit = defineEmits([
  "DrawType",
  "clearVectorLayer",
  "exportVectorLayer",
  "StopVectorLayer",
  "UploadGeoJSON",
])
const selectType = ref("Point")
const drawType = [
  { value: "Point", label: "Point" },
  { value: "LineString", label: "LineString" },
  { value: "Polygon", label: "Polygon" },
]
const fileName = ref("")

const handlePreview = (file) => {
  console.log("Preview:", file)
}

const handleRemove = (file, fileList) => {
  console.log("Remove:", file, fileList)
}

const beforeRemove = (file, fileList) => {
  return confirm(`确定移除 ${file.name}？`)
}

const handleExceed = (files, fileList) => {
  alert(`最多只能上传 3 个文件`)
}
const handleChange = (file, fileList) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target.result
    loadGeoJSON(content)
  }
  reader.readAsText(file.raw)
}

const loadGeoJSON = (geojsonData) => {
  // console.log("🚀 ~ loadGeoJSON ~ geojsonData:", geojsonData)
  emit("UploadGeoJSON", geojsonData)
  // const vectorSource = new VectorSource({
  //   features: new GeoJSON().readFeatures(geojsonData, {
  //     featureProjection: map.value.getView().getProjection(),
  //   }),
  // })
}
const StopVectorLayer = () => {
  emit("StopVectorLayer")
}
const DrawTypeChange = (value: string) => {
  console.log("🚀 ~ DrawTypeChange ~ value:", value)
  emit("DrawType", value)
}
const exportVectorLayer = () => {
  emit("exportVectorLayer")
}
const clearVectorLayer = () => {
  emit("clearVectorLayer")
}
// ["Point", "LineString", "Polygon"]
</script>


<style  scoped>
.DrawMenu {
  width: 30vw;
  display: flex;
  flex-direction: row;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  background-color: rgb(206, 206, 206);
}
</style>