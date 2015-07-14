package dhanifudin.ohmytrack.model.entity;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import dhanifudin.ohmytrack.Application;
import dhanifudin.ohmytrack.Constant;
import dhanifudin.ohmytrack.R;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import timber.log.Timber;

/**
 * Created by icub on 5/4/15.
 */
public class Preferences {

//    private static final String KEY_LOGIN = "key_login";
//    private static final String KEY_USERNAME = "key_username";
//    private static final String KEY_SERVER = "key_server";
//    private static final String KEY_PORT = "key_port";
//    private static final String KEY_URI = "key_uri";
//    private static final String KEY_CLIENT_ID = "key_client_id";
//    private static final String KEY_KEEP_ALIVE = "key_keep_alive";
//    private static final String KEY_CONNECTION_TIMEOUT = "key_connection_timeout";

    private SharedPreferences sharedPreferences;
    private SharedPreferences.Editor editor;
    private Context context;

    private static Preferences instance;

    private Preferences() {
        this.context = Application.getContext();
        this.sharedPreferences = PreferenceManager.getDefaultSharedPreferences(context);
        this.editor = sharedPreferences.edit();
        PreferenceManager.setDefaultValues(context, R.xml.preferences, false);
    }

    public static Preferences getInstance() {
        if (instance == null) {
            instance = new Preferences();
        }
        return instance;
    }

//    public void configureClient(String username) {
//        editor.putString(KEY_USERNAME, username);
//        editor.putString(KEY_URI, String.format("tcp://%s:%s", getServer(), getPort()));
//        editor.putString(KEY_CLIENT_ID, String.format("droidtrack_%s", username));
//        editor.commit();
//    }

    public void storeLoginSession() {
        editor.putBoolean(Constant.KEY_LOGIN, true);
        editor.commit();
    }

    public void clearLoginSession() {
        editor.remove(Constant.KEY_LOGIN);
        editor.remove(Constant.KEY_USERNAME);
//        editor.remove(Constant.KEY_URI);
//        editor.remove(Constant.KEY_CLIENT_ID);
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
        return sharedPreferences.getBoolean(Constant.KEY_LOGIN, false);
    }

    public String getUri() {
        return sharedPreferences.getString(Constant.KEY_URI, "");
    }

    public String getClientId() {
        return sharedPreferences.getString(Constant.KEY_CLIENT_ID, "");
    }

    public String getUsername() {
        return sharedPreferences.getString(Constant.KEY_USERNAME, "");
    }

    public void setUsername(String username) {
        editor.putString(Constant.KEY_USERNAME, username);
        editor.commit();
        Timber.d("Current Username: %s", getUsername());
        Timber.d("Set username into: %s", username);
        Timber.d("Username: %s", getUsername());
    }

    public String getServer() {
        return sharedPreferences.getString(Constant.KEY_SERVER, null);
    }

    public int getPort() {
        return getInt(Constant.KEY_PORT, 1883);
    }

    public int getKeepAlive() {
        return getInt(Constant.KEY_KEEP_ALIVE, 30);
    }

    public int getConnectionTimeout() {
        return getInt(Constant.KEY_CONNECTION_TIMEOUT, 60);
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
