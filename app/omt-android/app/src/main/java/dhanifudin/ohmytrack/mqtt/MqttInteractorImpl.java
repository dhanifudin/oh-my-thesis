package dhanifudin.ohmytrack.mqtt;

/**
 * Created by icub on 6/13/15.
 */
public class MqttInteractorImpl implements MqttInteractor {

    private static MqttInteractorImpl instance = null;

    private MqttInteractorImpl() {}

    public static MqttInteractorImpl getInstance() {
        if (instance == null) {
            instance = new MqttInteractorImpl();
        }
        return instance;
    }

    @Override
    public void connect(ConnectListener listener) {

    }

    @Override
    public void publish(PublishListener listener) {

    }

    @Override
    public void subscribe(SubscribeListener listener) {

    }

    @Override
    public void disconnect(DisconnectListener listener) {

    }
}
