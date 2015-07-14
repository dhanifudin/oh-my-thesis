package dhanifudin.ohmytrack;

import android.content.Context;
import com.squareup.otto.Bus;
import dhanifudin.ohmytrack.provider.BusProvider;
import timber.log.Timber;

/**
 * Created by icub on 5/4/15.
 */
public class Application extends android.app.Application {

    private static final Bus bus = BusProvider.getInstance();
    private static Context context;

//    private static Application instance;
//
//    public static Application getInstance() {
//        return instance;
//    }

    @Override
    public void onCreate() {
        super.onCreate();
        Application.context = getApplicationContext();
        Timber.plant(new Timber.DebugTree());
    }

    public static Context getContext() {
        return context;
    }

    //region Otto
    public void register(Object object) {
        bus.register(object);
    }

    public void unregister(Object object) {
        bus.unregister(object);
    }

    public void post(Object event) {
        bus.post(event);
    }
    //endredion Otto

}
