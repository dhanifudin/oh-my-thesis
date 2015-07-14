package dhanifudin.ohmytrack.provider;

import android.content.Context;
import dhanifudin.ohmytrack.Application;
import dhanifudin.ohmytrack.Constant;
import dhanifudin.ohmytrack.model.entity.Preferences;
import org.eclipse.paho.android.service.MqttAndroidClient;
import timber.log.Timber;

/**
 * Created by icub on 5/6/15.
 */
public class ClientProvider {

    private static MqttAndroidClient client = null;

    private ClientProvider() {}

    public static MqttAndroidClient getInstance(String username) {
        Preferences preferences = Preferences.getInstance();
        Context context = Application.getContext();
        if (client == null || !client.isConnected()) {
            String uri = String.format(
                    "tcp://%s:%d",
                    preferences.getServer(),
                    preferences.getPort()
            );
//            String clientId = String.format(
//                    "%s_%s",
//                    Constant.CLIENT_PREFIX,
//                    preferences.getUsername()
//            );
            String clientId = String.format(
                    "%s_%s",
                    Constant.CLIENT_PREFIX,
                    username
            );
            Timber.d("Uri: %s, ClientId: %s", uri, clientId);
            client = new MqttAndroidClient(context, uri, clientId);
            Timber.d("Instantiate MQTT android client");
        }
        return client;
    }

}
