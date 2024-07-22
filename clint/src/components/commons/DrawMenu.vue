<template>
  <div class="DrawMenu">
    <el-select
      v-model="selectType"
      @change="DrawTypeChange"
      placeholder="Select"
      size="small"
    >
      <el-option
        v-for="item in drawType"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-button type="primary" size="small" @click="exportVectorLayer"
      >Export</el-button
    >
    <el-button type="primary" size="small" @click="clearVectorLayer"
      >Clear</el-button
    >
  </div>
</template>
<script setup lang='ts'>
import { ref, reactive } from "vue"
const emit = defineEmits(["DrawType", "clearVectorLayer", "exportVectorLayer"])
const selectType = ref("Point")
const drawType = [
  { value: "Point", label: "Point" },
  { value: "LineString", label: "LineString" },
  { value: "Polygon", label: "Polygon" },
]
const DrawTypeChange = (value: string) => {
  // console.log("🚀 ~ DrawTypeChange ~ value:", value)
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
  padding: 5px;
  display: flex;
  flex-direction: row;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  gap: 10px;
  background-color: rgb(206, 206, 206);
}
</style>