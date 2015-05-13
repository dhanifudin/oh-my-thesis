package dhanifudin.ohmytrack.location;

import android.content.Context;
import android.content.Intent;

/**
 * Created by icub on 5/4/15.
 */
public class LocationInteractorImpl implements LocationInteractor {

    private Context context;
    private Intent intent;

    public LocationInteractorImpl(Context context) {
        this.context = context;
        this.intent = new Intent(context, LocationService.class);
    }

    @Override
    public void startLocationUpdates() {
        context.startService(intent);
    }

    @Override
    public void stopLocationUpdates() {
        context.stopService(intent);
    }
}
