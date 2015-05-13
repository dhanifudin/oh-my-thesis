package dhanifudin.ohmytrack.ui.fragment;

import android.os.Bundle;
import android.view.MenuItem;
import android.widget.EditText;
import butterknife.InjectView;
import dhanifudin.ohmytrack.Application;
import dhanifudin.ohmytrack.R;
import dhanifudin.ohmytrack.ui.common.BaseActivity;
import dhanifudin.ohmytrack.ui.common.BaseFragment;
import dhanifudin.ohmytrack.ui.login.LoginPresenter;
import dhanifudin.ohmytrack.ui.login.LoginPresenterImpl;
import dhanifudin.ohmytrack.ui.login.LoginView;

/**
 * Created by icub on 5/5/15.
 */
public class LoginFragment extends BaseFragment implements LoginView {

    @InjectView(R.id.username_text)
    EditText usernameText;

    private LoginPresenter presenter;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        presenter = new LoginPresenterImpl(getActivity(), this);
        Application.register(this);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Application.unregister(this);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.action_login:
                presenter.validateCredentials(usernameText.getText().toString());
                return true;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    protected int getLayoutResource() {
        return R.layout.fragment_login;
    }

    @Override
    protected int getMenuLayoutResource() {
        return R.menu.menu_login;
    }

    @Override
    public void setUsernameError() {
        usernameText.setError("Username cannot be empty");
    }

    @Override
    public void navigateToHome() {
        ((BaseActivity) getActivity()).setFragment(MapFragment.class);
    }
}
