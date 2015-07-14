package dhanifudin.ohmytrack.mqtt;

/**
 * Created by icub on 6/13/15.
 */
public interface MqttInteractor {

    public void connect(ConnectListener listener);

    public void publish(PublishListener listener);

    public void subscribe(SubscribeListener listener);

    public void disconnect(DisconnectListener listener);

}
