package dhanifudin.ohmytrack.ui.login;

/**
 * Created by icub on 5/5/15.
 */
public interface OnLoginFinishedListener {

    public void onUsernameError();

    public void onSucces(String username);

    public void onFailure(Throwable e);
}
