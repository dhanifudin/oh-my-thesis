package dhanifudin.ohmytrack;

import com.squareup.otto.Bus;
import dhanifudin.ohmytrack.model.Preferences;
import dhanifudin.ohmytrack.provider.BusProvider;
import timber.log.Timber;

/**
 * Created by icub on 5/4/15.
 */
public class Application extends android.app.Application {

    private static final Bus bus = BusProvider.getInstance();

    @Override
    public void onCreate() {
        super.onCreate();
        Timber.plant(new Timber.DebugTree());
    }

    //region Otto
    public static void register(Object object) {
        bus.register(object);
    }

    public static void unregister(Object object) {
        bus.unregister(object);
    }

    public static void post(Object event) {
        bus.post(event);
    }
    //endredion Otto

}
