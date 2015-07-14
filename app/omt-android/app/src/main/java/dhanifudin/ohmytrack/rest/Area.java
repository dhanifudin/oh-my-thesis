package dhanifudin.ohmytrack.rest;

import java.io.Serializable;

/**
 * Created by icub on 6/21/15.
 */
public class Area implements Serializable {

    private String code;
    private String level;
    private String name;

    public Area(String code, String level, String name) {
        this.code = code;
        this.level = level;
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return String.format(
                "%s -> %s",
                level, name
        );
    }
}

