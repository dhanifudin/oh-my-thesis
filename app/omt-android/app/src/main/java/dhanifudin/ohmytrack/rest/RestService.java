package dhanifudin.ohmytrack.rest;

import retrofit.Callback;
import retrofit.http.GET;

import java.util.List;

/**
 * Created by icub on 6/21/15.
 */
public interface RestService {

    @GET("/api/users")
    void getUsers(Callback<List<User>> response);

    @GET("/api/areas")
    void getAreas(Callback<List<Area>> response);
}
