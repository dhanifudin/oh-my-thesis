package dhanifudin.ohmytrack.mqtt;

import android.content.Context;
import dhanifudin.ohmytrack.Application;
import dhanifudin.ohmytrack.Constant;
import dhanifudin.ohmytrack.model.event.ConnectionLostEvent;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttMessage;

/**
 * Created by icub on 6/14/15.
 */
public class MqttCallbackHandler implements MqttCallback {

    private Context context;
    private Application application;

    public MqttCallbackHandler(Context context) {
        this.context = context;
        this.application = (Application) context.getApplicationContext();
        this.application.register(this);
    }

    @Override
    public void connectionLost(Throwable throwable) {
        this.application.post(new ConnectionLostEvent());
    }

    @Override
    public void messageArrived(String topic, MqttMessage message) throws Exception {
        if (topic.equalsIgnoreCase(Constant.TOPIC_LOCATION)) {

        } else if (topic.equalsIgnoreCase(Constant.TOPIC_TRACK)) {

        } else if (topic.equalsIgnoreCase(Constant.TOPIC_UNTRACK)) {

        } else {

        }
    }

    @Override
    public void deliveryComplete(IMqttDeliveryToken iMqttDeliveryToken) {
        // Do nothing
    }
}
