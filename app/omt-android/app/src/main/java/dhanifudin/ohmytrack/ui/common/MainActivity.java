package dhanifudin.ohmytrack.ui.common;

import android.os.Bundle;
import android.view.MenuItem;
import dhanifudin.ohmytrack.R;
import dhanifudin.ohmytrack.model.entity.Preferences;
import dhanifudin.ohmytrack.ui.fragment.LoginFragment;
import dhanifudin.ohmytrack.ui.fragment.MapFragment;
import dhanifudin.ohmytrack.ui.fragment.SettingFragment;

/**
 * Created by icub on 5/4/15.
 */
public class MainActivity extends BaseActivity {

//    private Preferences preferences;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        this.preferences = Preferences.getInstance();
    }

//    @Override
//    public boolean onOptionsItemSelected(MenuItem item) {
//        switch (item.getItemId()) {
//            case R.id.action_settings:
//                this.setFragment(SettingFragment.class, true);
//                return true;
//        }
//        return super.onOptionsItemSelected(item);
//    }

    @Override
    protected void onResume() {
        super.onResume();
        this.showApplication();
    }

    @Override
    protected int getLayoutResource() {
        return R.layout.activity_main;
    }

    private void showApplication() {
//        setFragment(TrackFragment.class);
        if (preferences.isLogin()) {
            setFragment(MapFragment.class);
        } else {
            setFragment(LoginFragment.class);
        }
    }
}
