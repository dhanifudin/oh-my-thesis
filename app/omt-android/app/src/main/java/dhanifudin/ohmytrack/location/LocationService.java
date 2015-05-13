package dhanifudin.ohmytrack.location;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.IBinder;
import com.squareup.otto.Produce;
import dhanifudin.ohmytrack.Application;
import timber.log.Timber;

/**
 * Created by icub on 5/4/15.
 */
public class LocationService extends Service implements LocationListener {

    public static final int LOCATION_UPDATE_FREQUENCY = 1000 * 6;
    public static final int LOCATION_UPDATE_DISTANCE = 1;

    private LocationManager manager;
    private Location currentLocation;

    @Override
    public void onCreate() {
        super.onCreate();
        Application.register(this);
        Timber.d("Location service created");
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Application.unregister(this);
        Timber.d("Location service destroyed");
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        manager = (LocationManager) this.getSystemService(Context.LOCATION_SERVICE);
        Criteria criteria = new Criteria();
        String provider = manager.getBestProvider(criteria, false);
        manager.requestLocationUpdates(provider, LOCATION_UPDATE_DISTANCE, LOCATION_UPDATE_FREQUENCY, this);
        return Service.START_STICKY;
    }

    @Override
    public boolean onUnbind(Intent intent) {
        manager.removeUpdates(this);
        return super.onUnbind(intent);
    }

    @Override
    public void onLocationChanged(Location location) {
        double latitude = location.getLatitude();
        double longitude = location.getLongitude();
        Timber.d(String.format("Location found, latitude: %f, longitude: %f", latitude, longitude));
        Application.post(new LocationEvent("Test", latitude, longitude));
    }

    @Override
    public void onStatusChanged(String s, int i, Bundle bundle) {

    }

    @Override
    public void onProviderEnabled(String s) {

    }

    @Override
    public void onProviderDisabled(String s) {

    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Produce
    public LocationEvent produceLocationEvent() {
        return (currentLocation != null) ?
            new LocationEvent(
                "Test",
                currentLocation.getLatitude(),
                currentLocation.getLongitude()
            )
            : null;
    }
}
