package dhanifudin.ohmytrack.ui.login;

import android.content.Context;
import android.text.TextUtils;
import dhanifudin.ohmytrack.model.Preferences;
import org.eclipse.paho.client.mqttv3.IMqttActionListener;
import org.eclipse.paho.client.mqttv3.IMqttToken;
import timber.log.Timber;

/**
 * Created by icub on 5/5/15.
 */

public class LoginPresenterImpl implements LoginPresenter, IMqttActionListener {

    private Context context;
    private LoginView loginView;
    private LoginInteractor loginInteractor;
    private Preferences preferences;

    public LoginPresenterImpl(Context context, LoginView loginView) {
        this.context = context;
        this.loginView = loginView;
        this.loginInteractor = new LoginInteractorImpl(context);
        this.preferences = Preferences.getInstance(context);
    }

    @Override
    public void validateCredentials(String username) {
        if (TextUtils.isEmpty(username)) {
            this.loginView.setUsernameError();
        } else {
            this.loginInteractor.login(username, this);
        }
    }

    @Override
    public void onSuccess(IMqttToken iMqttToken) {
        Timber.d("Login Sukses");
        this.preferences.storeLoginSession();
        this.loginView.navigateToHome();
    }

    @Override
    public void onFailure(IMqttToken iMqttToken, Throwable throwable) {
        Timber.e(throwable, "Failed");
    }

//    @Override
//    public void onUsernameError() {
//        this.loginView.setUsernameError();
//    }
//
//    @Override
//    public void onSucces(String username) {
//        this.loginView.navigateToHome();
//    }
//
//    @Override
//    public void onFailure(Throwable e) {
//        Timber.e(e, "Fail to connect");
//    }
}
