package dhanifudin.ohmytrack.provider;

import dhanifudin.ohmytrack.Constant;
import dhanifudin.ohmytrack.model.entity.Preferences;
import org.eclipse.paho.android.service.MqttAndroidClient;
import org.eclipse.paho.client.mqttv3.IMqttActionListener;
import org.eclipse.paho.client.mqttv3.MqttException;
import timber.log.Timber;

/**
 * Created by icub on 6/14/15.
 */
public class MqttProvider {

    private static MqttProvider instance = null;

//    private static MqttAndroidClient client = null;
    private Preferences preferences;
    private MqttAndroidClient client;

    private MqttProvider() {
//        this.preferences = preferences;
//        this.client = client;
    }

    public static MqttProvider getInstance() {
        if (instance == null) {
            instance = new MqttProvider();
        }
        return instance;
    }

    public void connect(String username, IMqttActionListener listener) {
        try {
            this.client = ClientProvider.getInstance(username);
            this.preferences = Preferences.getInstance();
            this.client.connect(preferences.getMqttOptions(), null, listener);
        } catch (MqttException e) {
            Timber.e(e.getMessage());
        }
    }

    public void reconnect(IMqttActionListener listener) {
        try {
            this.client = ClientProvider.getInstance(preferences.getUsername());
            this.client.connect(preferences.getMqttOptions(), null, listener);
        } catch (MqttException e) {
            Timber.e(e.getMessage());
        }
    }

    public void track(String filter, IMqttActionListener listener) {
        try {
            client.publish(Constant.TOPIC_TRACK, filter.getBytes(), 0, false, true, listener);
        } catch (MqttException e) {
            Timber.e(e.getMessage());
        }
    }

    public void untrack(String filter, IMqttActionListener listener) {
        try {
            client.publish(Constant.TOPIC_UNTRACK, filter.getBytes(), 0, false, true, listener);
        } catch (MqttException e) {
            Timber.e(e.getMessage());
        }
    }

    public void subscribe(IMqttActionListener listener) {
        try {
            client.subscribe(preferences.getClientId(), 0, null, listener);
        } catch (MqttException e) {
            Timber.e(e.getMessage());
        }
    }

//    public MqttAndroidClient createClient(Context context) {
//
//    }
}
