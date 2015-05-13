package dhanifudin.ohmytrack.mqtt;

import android.content.Context;
import org.eclipse.paho.android.service.MqttAndroidClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;

/**
 * Created by icub on 5/5/15.
 */
public class Connection {

    private String clientHandle;
    private String clientId;
    private String host;
    private int port;
    private MqttAndroidClient client;
    private Context context;
    private MqttConnectOptions connectOptions;

    public Connection(
            String clientHandle,
            String clientId,
            String host,
            int port,
            Context context,
            MqttAndroidClient client
    ) {
        this.clientHandle = clientHandle;
        this.clientId = clientId;
        this.host = host;
        this.port = port;
        this.context = context;
        this.client = client;
    }

    public static Connection createConnection(
            String clientId,
            String host,
            int port,
            Context context
    ) {
        String uri = String.format("tcp://%s:%d");
        String handle = uri + clientId;
        MqttAndroidClient client = new MqttAndroidClient(context, uri, clientId);
        return new Connection(handle, clientId, host, port, context, client);
    }
}
