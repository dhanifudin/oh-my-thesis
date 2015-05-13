package dhanifudin.ohmytrack.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;
import butterknife.ButterKnife;
import butterknife.InjectView;
import dhanifudin.ohmytrack.R;
import dhanifudin.ohmytrack.model.Track;

import java.util.List;

/**
 * Created by icub on 5/7/15.
 */
public class TrackAdapter extends ArrayAdapter<Track> {

    private final Context context;
    private List<Track> items;

    public TrackAdapter(Context context, List<Track> items) {
        super(context, R.layout.item_track, items);
        this.context = context;
        this.items = items;
    }

    @Override
    public View getView(int position, View view, ViewGroup parent) {
        ViewHolder holder;
        if (view != null) {
            holder = (ViewHolder) view.getTag();
        } else {
            LayoutInflater inflater = LayoutInflater.from(context);
            view = inflater.inflate(R.layout.item_track, null);
            holder = new ViewHolder(view);
            view.setTag(holder);
        }

        Track item = items.get(position);
        holder.trackText.setText(item.getTitle());
        return view;
    }

    static class ViewHolder {

        @InjectView(R.id.track_text)
        TextView trackText;

        public ViewHolder(View view) {
            ButterKnife.inject(this, view);
        }
    }

}
