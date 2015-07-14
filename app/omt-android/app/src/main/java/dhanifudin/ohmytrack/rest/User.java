package dhanifudin.ohmytrack.rest;

import java.io.Serializable;

/**
 * Created by icub on 6/21/15.
 */
public class User implements Serializable {

    private int id;
    private String username;
    private String name;

    public User(int id, String username, String name) {
        this.id = id;
        this.username = username;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return name;
    }
}
