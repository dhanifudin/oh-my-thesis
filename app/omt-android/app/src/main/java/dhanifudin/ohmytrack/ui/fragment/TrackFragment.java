package dhanifudin.ohmytrack.ui.fragment;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;
import butterknife.InjectView;
import dhanifudin.ohmytrack.Application;
import dhanifudin.ohmytrack.R;
import dhanifudin.ohmytrack.adapter.TrackAdapter;
import dhanifudin.ohmytrack.model.Track;
import dhanifudin.ohmytrack.ui.common.BaseFragment;
import timber.log.Timber;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by icub on 5/7/15.
 */
public class TrackFragment extends BaseFragment {
    @InjectView(R.id.track_list)
    ListView trackList;

    private List<Track> items;
    private TrackAdapter adapter;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Application.register(this);
    }

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = super.onCreateView(inflater, container, savedInstanceState);
        this.items = new ArrayList<Track>();
        this.adapter = new TrackAdapter(getActivity(), items);
        this.adapter.add(new Track("Test 1"));
        this.adapter.add(new Track("Test 2"));
        this.adapter.add(new Track("Test 3"));
        Timber.d("Items length: " + this.items.size());
        this.trackList.setAdapter(this.adapter);
        return view;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        Timber.d("Menu ID: " + item.getItemId());
        switch (item.getItemId()) {
            case R.id.action_add_track:
                this.adapter.add(new Track("Test " + (this.items.size() + 1)));
                Timber.d("add item");
                return true;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    protected int getLayoutResource() {
        return R.layout.fragment_track;
    }

    @Override
    protected int getMenuLayoutResource() {
        return R.menu.menu_track;
    }
}
