package dhanifudin.ohmytrack.ui.login;

import org.eclipse.paho.client.mqttv3.IMqttActionListener;

/**
 * Created by icub on 5/5/15.
 */
public interface LoginInteractor {

    public void login(String username, IMqttActionListener listener);

}
