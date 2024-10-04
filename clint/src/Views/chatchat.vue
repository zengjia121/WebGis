<template>
  <div class="chatRoom">
    <h1>Chat Room</h1>
    <ul id="messages">
      <li v-for="message in messages" :key="message">{{ message }}</li>
    </ul>
    <input
      v-model="messageInput"
      type="text"
      placeholder="Type a message..."
      @keyup.enter="sendMessage"
    />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"
import WebSocketService from "../api/WebSocket"
let ws = new WebSocketService(`ws://localhost:3000`)
const messages = ws.messages
const messageInput = ref("")
const isWebSocketOpen = ref(false)

onMounted(() => {
  // ws = new WebSocket(`ws://${location.host}`)
  ws.connect()
})

onBeforeUnmount(() => {
  ws.close()
})

const sendMessage = () => {
  if (messageInput.value.trim() !== "") {
    ws.sendMessage(messageInput.value)
    messageInput.value = ""
  } else {
    console.error("WebSocket is not open.")
  }
}
</script>

<style>
#messages {
  list-style-type: none;
  padding: 0;
}
#messages li {
  padding: 8px;
  margin-bottom: 4px;
  background-color: #f1f1f1;
}
.chatRoom {
  width: 50%;
  margin: 0 auto;
}
</style>