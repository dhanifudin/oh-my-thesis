package dhanifudin.ohmytrack.location;

/**
 * Created by icub on 5/4/15.
 */
public class LocationEvent {

    public String user;
    public double latitude, longitude;

    public LocationEvent(String user, double latitude, double longitude) {
        this.user = user;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    @Override
    public String toString() {
        return String.format(
            "User: %s\n Latitude: %f\n Longitude: %f\n",
            user,
            latitude,
            longitude
        );
    }
}
