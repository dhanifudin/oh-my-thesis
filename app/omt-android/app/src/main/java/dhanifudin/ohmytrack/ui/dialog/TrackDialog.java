package dhanifudin.ohmytrack.ui.dialog;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.DialogFragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.*;
import butterknife.ButterKnife;
import butterknife.InjectView;
import butterknife.OnClick;
import butterknife.OnItemSelected;
import dhanifudin.ohmytrack.Constant;
import dhanifudin.ohmytrack.R;
import dhanifudin.ohmytrack.rest.Area;
import dhanifudin.ohmytrack.rest.RestClient;
import dhanifudin.ohmytrack.rest.User;
import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;
import timber.log.Timber;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by icub on 6/19/15.
 */
public class TrackDialog extends DialogFragment {

    private RestClient restClient;
    private ArrayAdapter<User> userAdapter;
    private ArrayAdapter<Area> areaAdapter;

    @InjectView(R.id.user_layout)
    LinearLayout userLayout;

    @InjectView(R.id.area_layout)
    LinearLayout areaLayout;

    @InjectView(R.id.type_spinner)
    Spinner typeSpinner;

    @InjectView(R.id.user_spinner)
    Spinner userSpinner;

    @InjectView(R.id.area_spinner)
    Spinner areaSpinner;

    @InjectView(R.id.cancel_button)
    Button cancelButton;

    @InjectView(R.id.add_button)
    Button addButton;

    @InjectView(R.id.save_button)
    Button saveButton;

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.dialog_track, container, false);
        ButterKnife.inject(this, view);
        getDialog().setTitle("Add Track Filter");
        restClient = RestClient.getInstance();
        List<String> items = new ArrayList<String>();
        items.add(Constant.FILTER_BY_PEOPLE);
        items.add(Constant.FILTER_BY_AREA);
        ArrayAdapter<String> adapter = new ArrayAdapter<String>(
                getActivity(),
                android.R.layout.simple_spinner_item,
                items
        );
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        typeSpinner.setAdapter(adapter);

        restClient.getRestService().getUsers(new Callback<List<User>>() {
            @Override
            public void success(List<User> users, Response response) {
                userAdapter = new ArrayAdapter<User>(
                        getActivity(),
                        android.R.layout.simple_spinner_item,
                        users
                );
                userAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                userSpinner.setAdapter(userAdapter);
            }

            @Override
            public void failure(RetrofitError error) {
                Timber.e(error.getMessage());
            }
        });

        restClient.getRestService().getAreas(new Callback<List<Area>>() {
            @Override
            public void success(List<Area> areas, Response response) {
                areaAdapter = new ArrayAdapter<Area>(
                        getActivity(),
                        android.R.layout.simple_spinner_item,
                        areas
                );
                areaAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                areaSpinner.setAdapter(areaAdapter);
            }

            @Override
            public void failure(RetrofitError error) {
                Timber.e(error.getMessage());
            }
        });

        return view;
    }

    @OnItemSelected(R.id.type_spinner)
    void onTypeSelected(int position) {
        Toast.makeText(getActivity(), String.valueOf(position), Toast.LENGTH_LONG).show();
        switch (position) {
            case 0:
                userLayout.setVisibility(View.VISIBLE);
                areaLayout.setVisibility(View.GONE);
                break;
            case 1:
                userLayout.setVisibility(View.GONE);
                areaLayout.setVisibility(View.VISIBLE);
                break;
        }
    }

    @OnClick(R.id.cancel_button)
    void cancelClick() {
        this.dismiss();
    }

    @OnClick(R.id.add_button)
    void addClick() {

    }

    @OnClick(R.id.save_button)
    void saveClick() {
        this.dismiss();
    }
}
