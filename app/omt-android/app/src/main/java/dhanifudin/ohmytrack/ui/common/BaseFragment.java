package dhanifudin.ohmytrack.ui.common;

import android.app.Activity;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.*;
import butterknife.ButterKnife;
import dhanifudin.ohmytrack.Application;
import dhanifudin.ohmytrack.R;
import dhanifudin.ohmytrack.model.entity.Preferences;
import dhanifudin.ohmytrack.ui.fragment.LoginFragment;
import dhanifudin.ohmytrack.ui.fragment.SettingFragment;
import timber.log.Timber;

/**
 * Created by icub on 5/4/15.
 */
public abstract class BaseFragment extends Fragment {

    protected BaseActivity activity;
    protected Application application;
    protected Preferences preferences;

//    public BaseFragment(BaseActivity activity, Preferences preferences) {
//        this.activity = activity;
//        this.preferences = preferences;
//    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.setHasOptionsMenu(this.isHasOptionsMenu());
        this.activity = (BaseActivity) getActivity();
        this.preferences = activity.getPreferences();
        this.application = (Application) getActivity().getApplication();
        Timber.d(getClass().getCanonicalName() + " created....");
    }

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(this.getLayoutResource(), container, false);
        ButterKnife.inject(this, view);
        return view;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        ButterKnife.reset(this);
    }

    @Override
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        super.onCreateOptionsMenu(menu, inflater);
        inflater.inflate(this.getMenuLayoutResource(), menu);
        if (isHasMoreMenu())
            inflater.inflate(R.menu.menu_app, menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.action_settings:
                activity.setFragment(SettingFragment.class, true);
                return true;
            case R.id.action_logout:
                preferences.clearLoginSession();
                activity.setFragment(LoginFragment.class);
                return true;
        }
        return super.onOptionsItemSelected(item);
    }

    protected boolean isHasOptionsMenu() {
        return true;
    }

    protected boolean isHasMoreMenu() {
        return false;
    }

    protected abstract int getLayoutResource();

    protected abstract int getMenuLayoutResource();
}
