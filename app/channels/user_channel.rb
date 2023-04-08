class UserChannel < ApplicationCable::Channel
  def subscribed
    stream_from "user_channel"
    ActionCable.server.broadcast "user_channel", { message: "O usuário #{params[:userName]} se conectou" }
  end

  def unsubscribed
    ActionCable.server.broadcast "user_channel", { message: "O usuário #{params[:userName]} se desconectou" }
  end
end
