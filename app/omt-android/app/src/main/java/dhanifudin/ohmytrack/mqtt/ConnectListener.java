package dhanifudin.ohmytrack.mqtt;

import org.eclipse.paho.client.mqttv3.IMqttActionListener;
import org.eclipse.paho.client.mqttv3.IMqttToken;

/**
 * Created by icub on 5/5/15.
 */
public interface ConnectListener extends IMqttActionListener {

    public void onUsernameError();

}
