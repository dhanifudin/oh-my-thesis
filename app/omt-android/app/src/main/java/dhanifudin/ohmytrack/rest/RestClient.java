package dhanifudin.ohmytrack.rest;

import dhanifudin.ohmytrack.model.entity.Preferences;
import retrofit.RestAdapter;

/**
 * Created by icub on 6/21/15.
 */
public class RestClient {

    private static RestClient instance = null;

    private RestAdapter restAdapter;
    private Preferences preferences;

    private RestClient() {
        preferences = Preferences.getInstance();
        restAdapter = new RestAdapter.Builder()
                .setEndpoint(String.format("http://%s:%d", preferences.getServer(), 8000))
                .build();
    }

    public static RestClient getInstance() {
        if (instance == null) {
            instance = new RestClient();
        }
        return instance;
    }

    public RestService getRestService() {
        RestService service = restAdapter.create(RestService.class);
        return service;
    }
}
