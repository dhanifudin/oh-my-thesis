package dhanifudin.ohmytrack.model.entity;

import java.util.LinkedHashSet;
import java.util.Set;

/**
 * Created by icub on 6/14/15.
 */
public class Data {

    private static Data instance = null;

    private String username;
    private Set<String> tracks;

    private Data() {
        this.tracks = new LinkedHashSet<String>();
    }

    public static Data getInstance() {
        if (instance == null) {
            instance = new Data();
        }
        return instance;
    }

    public String getUsername() {
        return username;
    }

    public void track(String track) {
        this.tracks.add(track);
    }

    public void untrack(String track) {
        this.tracks.remove(track);
    }

    public Set<String> getTracks() {
        return tracks;
    }
}
