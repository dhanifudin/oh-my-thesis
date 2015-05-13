package dhanifudin.ohmytrack.ui.fragment;

import android.os.Bundle;
import android.support.v4.preference.PreferenceFragment;
import dhanifudin.ohmytrack.R;
import timber.log.Timber;

/**
 * Created by icub on 5/4/15.
 */
public class SettingFragment extends PreferenceFragment {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Timber.d(getClass().getCanonicalName() + " fragment created...");
        addPreferencesFromResource(R.xml.preferences);
    }
}
