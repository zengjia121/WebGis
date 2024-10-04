/** @format */

// websocketService.js
import { ref } from "vue";

class websocketService {
  private ws: WebSocket | null = null;
  public messages = ref<string[]>([]);
  public isWebSocketOpen = ref<boolean>(false);
  constructor(private url: string) {}
  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      this.messages.value.push(event.data);
    };

    this.ws.onopen = () => {
      console.log("WebSocket connection established");
      this.isWebSocketOpen.value = true;
    };

    this.ws.onclose = () => {
      console.log("WebSocket connection closed");
      this.isWebSocketOpen.value = false;
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.isWebSocketOpen.value = false;
    };
  }
  sendMessage(message: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      console.error("WebSocket is not open.");
    }
  }
  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export default websocketService;
