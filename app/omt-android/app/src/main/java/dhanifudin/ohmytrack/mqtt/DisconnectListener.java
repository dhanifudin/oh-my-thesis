package dhanifudin.ohmytrack.mqtt;

import org.eclipse.paho.client.mqttv3.IMqttActionListener;
import org.eclipse.paho.client.mqttv3.IMqttToken;

/**
 * Created by icub on 6/13/15.
 */
public class DisconnectListener implements IMqttActionListener {

    @Override
    public void onSuccess(IMqttToken iMqttToken) {

    }

    @Override
    public void onFailure(IMqttToken iMqttToken, Throwable throwable) {

    }

}
