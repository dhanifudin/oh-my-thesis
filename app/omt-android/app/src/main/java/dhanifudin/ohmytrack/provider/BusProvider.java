package dhanifudin.ohmytrack.provider;

import com.squareup.otto.Bus;

/**
 * Created by icub on 5/4/15.
 */
public class BusProvider {

    private static final Bus instance = new Bus();

    private BusProvider() {
    }

    public static Bus getInstance() {
        return instance;
    }
}
