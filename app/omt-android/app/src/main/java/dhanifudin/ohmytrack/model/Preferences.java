package dhanifudin.ohmytrack.model;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import dhanifudin.ohmytrack.R;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import timber.log.Timber;

/**
 * Created by icub on 5/4/15.
 */
public class Preferences {

    private static final String KEY_LOGIN = "key_login";
    private static final String KEY_USERNAME = "key_username";
    private static final String KEY_SERVER = "key_server";
    private static final String KEY_PORT = "key_port";
    private static final String KEY_URI = "key_uri";
    private static final String KEY_CLIENT_ID = "key_client_id";
    private static final String KEY_KEEP_ALIVE = "key_keep_alive";
    private static final String KEY_CONNECTION_TIMEOUT = "key_connection_timeout";

    private SharedPreferences sharedPreferences;
    private SharedPreferences.Editor editor;
    private Context context;

    private static Preferences instance;

    private Preferences(Context context) {
        PreferenceManager.setDefaultValues(context, R.xml.preferences, false);
        this.context = context;
        this.sharedPreferences = PreferenceManager.getDefaultSharedPreferences(context);
        this.editor = sharedPreferences.edit();
    }

    public static Preferences getInstance(Context context) {
        if (instance == null) {
            instance = new Preferences(context);
        }
        return instance;
    }

    public void configureClient(String username) {
        editor.putString(KEY_USERNAME, username);
        editor.putString(KEY_URI, String.format("tcp://%s:%s", getServer(), getPort()));
        editor.putString(KEY_CLIENT_ID, String.format("droidtrack_%s", username));
        editor.commit();
    }

    public void storeLoginSession() {
        editor.putBoolean(KEY_LOGIN, true);
        editor.commit();
    }

    public void clearLoginSession() {
        editor.remove(KEY_LOGIN);
        editor.remove(KEY_USERNAME);
        editor.remove(KEY_URI);
        editor.remove(KEY_CLIENT_ID);
        editor.commit();
    }

    public MqttConnectOptions getMqttOptions() {
        MqttConnectOptions options = new MqttConnectOptions();
        options.setCleanSession(true);
        options.setKeepAliveInterval(getKeepAlive());
        options.setConnectionTimeout(getConnectionTimeout());
        return options;
    }

    public boolean isLogin() {
        return sharedPreferences.getBoolean(KEY_LOGIN, false);
    }

    public String getUri() {
        return sharedPreferences.getString(KEY_URI, "");
    }

    public String getClientId() {
        return sharedPreferences.getString(KEY_CLIENT_ID, "");
    }

    public String getServer() {
        return sharedPreferences.getString(KEY_SERVER, null);
    }

    public int getPort() {
        return getInt(KEY_PORT, 1883);
    }

    public int getKeepAlive() {
        return getInt(KEY_KEEP_ALIVE, 30);
    }

    public int getConnectionTimeout() {
        return getInt(KEY_CONNECTION_TIMEOUT, 60);
    }

    private int getInt(String key, int defaultValue) {
        int number = defaultValue;
        try {
            number = Integer.parseInt(sharedPreferences.getString(key, ""));
        } catch (NumberFormatException e) {
            Timber.e(e.getMessage());
        }
        return number;
    }

}
