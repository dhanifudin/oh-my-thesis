package dhanifudin.ohmytrack.ui.fragment;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import butterknife.InjectView;
import dhanifudin.ohmytrack.Application;
import dhanifudin.ohmytrack.R;
import dhanifudin.ohmytrack.ui.common.BaseFragment;
import org.osmdroid.api.IMapController;
import org.osmdroid.util.GeoPoint;
import org.osmdroid.views.MapView;

/**
 * Created by icub on 5/5/15.
 */
public class MapFragment extends BaseFragment {
    @InjectView(R.id.map)
    MapView map;

    private IMapController controller;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Application.register(this);
    }

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = super.onCreateView(inflater, container, savedInstanceState);
        this.map.setClickable(true);
        this.map.setBuiltInZoomControls(true);
        this.controller = this.map.getController();
        this.controller.setZoom(15);
        this.controller.setCenter(new GeoPoint(52.221, 6.893));
        return view;
    }

    @Override
    public void onPause() {
        super.onPause();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Application.unregister(this);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.action_add:
                return true;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    protected int getLayoutResource() {
        return R.layout.fragment_map;
    }

    @Override
    protected int getMenuLayoutResource() {
        return R.menu.menu_map;
    }
}
