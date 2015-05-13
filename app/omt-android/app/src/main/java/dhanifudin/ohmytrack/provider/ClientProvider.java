package dhanifudin.ohmytrack.provider;

import android.content.Context;
import dhanifudin.ohmytrack.model.Preferences;
import org.eclipse.paho.android.service.MqttAndroidClient;
import timber.log.Timber;

/**
 * Created by icub on 5/6/15.
 */
public class ClientProvider {

    private static MqttAndroidClient client = null;

    private ClientProvider() {}

    public static MqttAndroidClient getInstance(Context context) {
        Preferences preferences = Preferences.getInstance(context);
        if (client == null || !client.isConnected()) {
            Timber.d("Uri: " + preferences.getUri());
            Timber.d("ClientId: " + preferences.getClientId());
            client = new MqttAndroidClient(context, preferences.getUri(), preferences.getClientId());
            Timber.d("Instantiate MQTT android client");
        }
        return client;
    }
}
