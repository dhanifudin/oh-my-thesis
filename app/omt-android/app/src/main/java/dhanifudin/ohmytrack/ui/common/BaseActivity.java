package dhanifudin.ohmytrack.ui.common;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.app.ActionBarActivity;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import butterknife.ButterKnife;
import butterknife.InjectView;
import dhanifudin.ohmytrack.Application;
import dhanifudin.ohmytrack.R;
import dhanifudin.ohmytrack.model.entity.Preferences;
import timber.log.Timber;

import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;

/**
 * Created by icub on 5/4/15.
 */
public abstract class BaseActivity extends AppCompatActivity {

    @InjectView(R.id.toolbar)
    Toolbar toolbar;

//    protected Application application;
    protected Preferences preferences;
    protected HashMap<String, Fragment> fragments;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.setContentView(getLayoutResource());
        ButterKnife.inject(this);

//        this.application = (Application) getApplicationContext();
        this.preferences = Preferences.getInstance();
        this.fragments = new HashMap<String, Fragment>();

        if (toolbar != null) {
            this.setSupportActionBar(toolbar);
            this.getSupportActionBar().setDisplayHomeAsUpEnabled(this.isHomeAsUpEnabled());
        }
        Timber.d(getClass().getCanonicalName() + " on create");
    }

    @Override
    protected void onResume() {
        super.onResume();
        Timber.d(getClass().getCanonicalName() + " on resume");
    }

    @Override
    protected void onPause() {
        super.onPause();
        Timber.d(getClass().getCanonicalName() + " on pause");
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        Timber.d(getClass().getCanonicalName() + " on restart");
    }

    public void setFragment(Class<? extends Fragment> fragmentClass) {
        this.setFragment(fragmentClass, false);
    }

    public void setFragment(Class<? extends Fragment> fragmentClass, boolean backStack) {
        Fragment fragment = null;
        String stringClass = fragmentClass.getCanonicalName();
        try {
            fragment = fragments.get(stringClass);
            if (fragment == null) {
//                fragment = fragmentClass.getDeclaredConstructor(Application.class)
//                        .newInstance(application);
                fragment = fragmentClass.newInstance();
                fragments.put(stringClass, fragment);
            }
        } catch (IllegalAccessException e) {
            Timber.e(e.getMessage());
        } catch (InstantiationException e) {
            Timber.e(e.getMessage());
        }

        FragmentManager fragmentManager = getSupportFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.replace(R.id.fragment_container, fragment);
        if (backStack)
            fragmentTransaction.addToBackStack(stringClass);
        fragmentTransaction.commit();
    }

    protected boolean isHomeAsUpEnabled() {
        return false;
    }

    protected void setActionBarIcon(int icon) {
        toolbar.setNavigationIcon(icon);
    }

    protected abstract int getLayoutResource();

    public Preferences getPreferences() {
        return preferences;
    }
}
