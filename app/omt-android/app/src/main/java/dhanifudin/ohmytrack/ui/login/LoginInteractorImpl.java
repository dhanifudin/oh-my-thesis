package dhanifudin.ohmytrack.ui.login;

import android.content.Context;
import dhanifudin.ohmytrack.model.entity.Preferences;
import dhanifudin.ohmytrack.provider.ClientProvider;
import org.eclipse.paho.android.service.MqttAndroidClient;
import org.eclipse.paho.client.mqttv3.IMqttActionListener;
import org.eclipse.paho.client.mqttv3.MqttException;
import timber.log.Timber;

/**
 * Created by icub on 5/5/15.
 */
public class LoginInteractorImpl implements LoginInteractor {

    private Context context;
    private Preferences preferences;

    public LoginInteractorImpl(Context context) {
        this.context = context;
        this.preferences = Preferences.getInstance();
    }

    @Override
    public void login(String username, IMqttActionListener listener) {
//        this.preferences.configureClient(username);
        MqttAndroidClient client = ClientProvider.getInstance(username);
        try {
            Timber.d("Connecting....");
            client.connect(preferences.getMqttOptions(), null, listener);
        } catch (MqttException e) {
            Timber.e(e.getMessage());
        }
    }
}
