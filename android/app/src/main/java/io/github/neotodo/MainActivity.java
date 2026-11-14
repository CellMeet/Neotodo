package io.github.neotodo;

import android.app.Activity;
import android.graphics.Color;
import android.graphics.Typeface;
import android.os.Bundle;
import android.util.Log;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.chaquo.python.PyObject;
import com.chaquo.python.Python;
import com.chaquo.python.android.AndroidPlatform;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * NeoTodo for Android.
 *
 * The desktop app is a Python HTTP backend plus a hand-written web workspace.
 * This activity starts the same backend locally and renders the same pages in a
 * full-screen WebView, so there is only one set of workspace logic to maintain.
 */
public class MainActivity extends Activity {

    private static final String TAG = "NeoTodo";
    private static final int PAPER = Color.rgb(247, 239, 227);
    private static final int INK = Color.rgb(45, 41, 34);
    private static final int MUTED = Color.rgb(136, 125, 108);

    private final ExecutorService starter = Executors.newSingleThreadExecutor();
    private WebViewSupport webSupport;
    private android.webkit.WebView webView;
    private View loadingLayer;
    private TextView loadingLabel;
    private TextView loadingDetail;
    private boolean revealed;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        if (android.os.Build.VERSION.SDK_INT >= 28) {
            WindowManager.LayoutParams attrs = getWindow().getAttributes();
            attrs.layoutInDisplayCutoutMode =
                    WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            getWindow().setAttributes(attrs);
        }
        buildContentView();
        WebViewSupport.immersive(this);
        startBackend();
    }

    private void buildContentView() {
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(PAPER);

        webView = new android.webkit.WebView(this);
        webSupport = new WebViewSupport(this, (path, uri) -> {
            // The modern JS bridge handles open/home; this keeps old page caches working.
            if ("/open".equals(path)) {
                String url = uri.getQueryParameter("url");
                if (url != null) {
                    android.content.Intent intent =
                            new android.content.Intent(this, DetachedActivity.class);
                    intent.putExtra(DetachedActivity.EXTRA_URL, url);
                    startActivity(intent);
                }
            }
        }, this::revealWorkspace);
        webSupport.attach(webView);
        webView.setAlpha(0f);
        root.addView(webView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        LinearLayout loading = new LinearLayout(this);
        loading.setOrientation(LinearLayout.VERTICAL);
        loading.setGravity(Gravity.CENTER_HORIZONTAL);
        loading.setPadding(dp(32), dp(32), dp(32), dp(32));
        loading.setBackgroundColor(PAPER);

        ImageView mark = new ImageView(this);
        mark.setImageResource(R.mipmap.ic_launcher);
        LinearLayout.LayoutParams markParams = new LinearLayout.LayoutParams(dp(96), dp(96));
        markParams.bottomMargin = dp(24);
        loading.addView(mark, markParams);

        TextView title = new TextView(this);
        title.setText("NeoTodo");
        title.setTextColor(INK);
        title.setTypeface(Typeface.create("serif", Typeface.BOLD));
        title.setTextSize(TypedValue.COMPLEX_UNIT_SP, 34);
        title.setLetterSpacing(0.02f);
        loading.addView(title);

        TextView subtitle = new TextView(this);
        subtitle.setText(R.string.loading_workspace);
        subtitle.setTextColor(MUTED);
        subtitle.setTextSize(TypedValue.COMPLEX_UNIT_SP, 12);
        subtitle.setLetterSpacing(0.08f);
        LinearLayout.LayoutParams subtitleParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        subtitleParams.topMargin = dp(8);
        loading.addView(subtitle, subtitleParams);

        ProgressBar progress = new ProgressBar(this);
        progress.setIndeterminate(true);
        LinearLayout.LayoutParams progressParams = new LinearLayout.LayoutParams(dp(26), dp(26));
        progressParams.topMargin = dp(28);
        loading.addView(progress, progressParams);

        loadingLabel = subtitle;
        loadingDetail = new TextView(this);
        loadingDetail.setTextColor(Color.rgb(182, 92, 80));
        loadingDetail.setTextSize(TypedValue.COMPLEX_UNIT_SP, 11);
        loadingDetail.setGravity(Gravity.CENTER);
        loadingDetail.setVisibility(View.GONE);
        LinearLayout.LayoutParams detailParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        detailParams.topMargin = dp(20);
        loading.addView(loadingDetail, detailParams);

        loadingLayer = loading;
        root.addView(loading, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        WebViewSupport.handleImeInsets(root);
        setContentView(root);
    }

    private void startBackend() {
        starter.execute(() -> {
            try {
                if (!Python.isStarted()) {
                    Python.start(new AndroidPlatform(getApplicationContext()));
                }
                PyObject port = Python.getInstance()
                        .getModule("android_server")
                        .callAttr("start", this);
                int value = port.toInt();
                Log.i(TAG, "backend listening on " + value);
                runOnUiThread(() -> {
                    if (isFinishing() || isDestroyed()) {
                        return;
                    }
                    webView.loadUrl("http://127.0.0.1:" + value + "/");
                    // The web layer calls ready() as soon as its first frame is complete.
                    // This fallback keeps the app usable even if a script error occurs.
                    webView.postDelayed(this::revealWorkspace, 8000);
                });
            } catch (Throwable error) {
                Log.e(TAG, "backend failed", error);
                runOnUiThread(() -> showFailure(error));
            }
        });
    }

    private void showFailure(Throwable error) {
        if (loadingLayer == null) {
            return;
        }
        loadingLabel.setText(R.string.loading_failed);
        loadingDetail.setVisibility(View.VISIBLE);
        String message = error.getMessage();
        loadingDetail.setText(message != null ? message : error.getClass().getSimpleName());
    }

    /** Reveals the live workspace once its first frame has painted. */
    private void revealWorkspace() {
        if (revealed || isFinishing() || webView == null) {
            return;
        }
        revealed = true;
        webView.setAlpha(1f);
        if (loadingLayer != null) {
            loadingLayer.animate().alpha(0f).setDuration(220)
                    .withEndAction(() -> {
                        if (loadingLayer != null && loadingLayer.getParent() instanceof ViewGroup) {
                            ((ViewGroup) loadingLayer.getParent()).removeView(loadingLayer);
                        }
                        loadingLayer = null;
                    });
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, android.content.Intent data) {
        if (webSupport != null && webSupport.onActivityResult(requestCode, resultCode, data)) {
            return;
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onBackPressed() {
        if (webView == null) {
            super.onBackPressed();
            return;
        }
        // Close one layer at a time: a dialog, drawer or open panel swallows the
        // first Back press. Only an empty desk sends the task to the background.
        webView.evaluateJavascript(BACK_SCRIPT, value -> {
            if (value == null || value.contains("exit")) {
                moveTaskToBack(true);
            }
        });
    }

    /**
     * Asks the workspace whether it owns the Back press. Dialogs and drawers
     * use the same Escape event as the desktop; the two bottom panels expose
     * their own close functions because Escape does not touch them when focus
     * is on the page instead of their text fields.
     */
    private static final String BACK_SCRIPT =
            "(function(){try{"
                    + "function esc(){var e=new KeyboardEvent('keydown',{key:'Escape',code:'Escape',bubbles:true});"
                    + "var t=document.activeElement;if(!t||typeof t.dispatchEvent!=='function')t=document.body;t.dispatchEvent(e);}"
                    + "var modal=document.getElementById('modal-root');"
                    + "if(modal&&modal.innerHTML.trim().length>0){esc();return 'closed';}"
                    + "if(document.querySelector('.settings-stage')){esc();return 'closed';}"
                    + "if(typeof archiveOpen!=='undefined'&&archiveOpen){esc();return 'closed';}"
                    + "if(typeof trashOpen!=='undefined'&&trashOpen){esc();return 'closed';}"
                    + "if(typeof completedOpen!=='undefined'&&completedOpen){esc();return 'closed';}"
                    + "if(typeof postcard!=='undefined'&&postcard){esc();return 'closed';}"
                    + "var sound=document.getElementById('sound-panel');"
                    + "if(sound&&!sound.hidden){esc();return 'closed';}"
                    + "if(typeof agentTerminalOpen!=='undefined'&&agentTerminalOpen){closeAgentTerminal();return 'closed';}"
                    + "if(typeof notesHidden!=='undefined'&&!notesHidden){hideNotesPanel();return 'closed';}"
                    + "if(typeof doingPeekOpen!=='undefined'&&doingPeekOpen){esc();return 'closed';}"
                    + "if(typeof completedSubtasksOpen!=='undefined'&&completedSubtasksOpen){esc();return 'closed';}"
                    + "return 'exit';}catch(err){return 'exit';}})()";

    @Override
    protected void onDestroy() {
        starter.shutdownNow();
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }

    private int dp(int value) {
        return Math.round(TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP, value, getResources().getDisplayMetrics()));
    }
}
