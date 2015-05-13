package dhanifudin.ohmytrack.mqtt;

import android.content.Context;
import org.eclipse.paho.client.mqttv3.IMqttActionListener;
import org.eclipse.paho.client.mqttv3.IMqttToken;

/**
 * Created by icub on 5/5/15.
 */
public class ActionListener implements IMqttActionListener {

    private Context context;
    private Action action;
    private String clientHandle;
    private String[] args;

    public ActionListener(Context context, Action action, String clientHandle, String... args) {
        this.context = context;
        this.action = action;
        this.clientHandle = clientHandle;
        this.args = args;
    }

    @Override
    public void onSuccess(IMqttToken iMqttToken) {
        switch (action) {
            case CONNECT:
                break;
            case DISCONNECT:
                break;
            case SUBSCRIBE:
                break;
            case PUBLISH:
                break;
        }
    }

    @Override
    public void onFailure(IMqttToken iMqttToken, Throwable throwable) {
        switch (action) {
            case CONNECT:
                break;
            case DISCONNECT:
                break;
            case SUBSCRIBE:
                break;
            case PUBLISH:
                break;
        }
    }
}
