import consumer from "./consumer"
import { faker } from "@faker-js/faker"

consumer.subscriptions.create({ channel: "UserChannel", userName: faker.name.fullName()}, {
  connected() {
    // Called when the subscription is ready for use on the server
    // console.log("Conectado ao UserChannel");
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    // Called when there's incoming data on the websocket for this channel
    // console.log(`${data.message} =====`)
  }
});
