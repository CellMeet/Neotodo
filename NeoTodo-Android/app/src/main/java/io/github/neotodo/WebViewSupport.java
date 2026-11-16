package io.github.neotodo;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Insets;
import android.graphics.Rect;
import android.net.Uri;
import android.os.Build;
import android.util.Log;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.webkit.ConsoleMessage;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

/** Shared WebView plumbing for the main workspace and detached note/AI panels. */
final class WebViewSupport {

    interface BridgeHandler {
        /** Called when the web layer asks the native shell to do something. */
        void onBridge(String path, Uri uri);
    }

    private static final String TAG = "NeoTodoWeb";
    private static final int FILE_CHOOSER_REQUEST = 7301;

    private final Activity activity;
    private final BridgeHandler bridge;
    private final Runnable onReady;
    private ValueCallback<Uri[]> pendingFiles;

    WebViewSupport(Activity activity, BridgeHandler bridge) {
        this(activity, bridge, null);
    }

    WebViewSupport(Activity activity, BridgeHandler bridge, Runnable onReady) {
        this.activity = activity;
        this.bridge = bridge;
        this.onReady = onReady;
    }

    void attach(WebView view) {
        view.setBackgroundColor(Color.rgb(247, 239, 227));
        view.setOverScrollMode(View.OVER_SCROLL_NEVER);
        view.setHapticFeedbackEnabled(false);
        WebView.setWebContentsDebuggingEnabled(true);

        WebSettings settings = view.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setTextZoom(100);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        if (Build.VERSION.SDK_INT >= 26) {
            settings.setSafeBrowsingEnabled(false);
        }

        view.addJavascriptInterface(new NativeBridge(), "NeoTodoAndroid");
        view.setWebViewClient(new ShellClient());
        view.setWebChromeClient(new ShellChromeClient());
    }

    boolean onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode != FILE_CHOOSER_REQUEST) {
            return false;
        }
        if (pendingFiles != null) {
            pendingFiles.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode, data));
            pendingFiles = null;
        }
        return true;
    }

    /** Keeps focused inputs above the soft keyboard in edge-to-edge mode. */
    static void handleImeInsets(View root) {
        if (Build.VERSION.SDK_INT >= 30) {
            root.setOnApplyWindowInsetsListener((view, insets) -> {
                Insets ime = insets.getInsets(WindowInsets.Type.ime());
                view.setPadding(0, 0, 0, Math.max(0, ime.bottom));
                return insets;
            });
            root.requestApplyInsets();
            return;
        }
        // Legacy fallback: compare the window height with the visible frame.
        root.getViewTreeObserver().addOnGlobalLayoutListener(
                new ViewTreeObserver.OnGlobalLayoutListener() {
                    @Override
                    public void onGlobalLayout() {
                        Rect visible = new Rect();
                        root.getWindowVisibleDisplayFrame(visible);
                        int covered = root.getRootView().getHeight() - visible.bottom;
                        root.setPadding(0, 0, 0, Math.max(0, covered));
                    }
                });
    }

    /** Hide the status and navigation bars so the workspace keeps its desk-like frame. */
    static void immersive(Activity activity) {
        try {
            activity.getWindow().getDecorView();
            if (Build.VERSION.SDK_INT >= 30) {
                activity.getWindow().setDecorFitsSystemWindows(false);
                WindowInsetsController controller = activity.getWindow().getInsetsController();
                if (controller != null) {
                    controller.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
                    controller.setSystemBarsBehavior(
                            WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
                }
            } else {
                activity.getWindow().getDecorView().setSystemUiVisibility(
                        View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                                | View.SYSTEM_UI_FLAG_FULLSCREEN
                                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
            }
        } catch (Exception ignored) {
            // Some preview/desktop windowing modes have no insets controller yet.
        }
    }

    private final class NativeBridge {
        @android.webkit.JavascriptInterface
        public void open(String url) {
            if (url == null || !url.startsWith("http://127.0.0.1")) {
                return;
            }
            activity.runOnUiThread(() -> {
                Intent intent = new Intent(activity, DetachedActivity.class);
                intent.putExtra(DetachedActivity.EXTRA_URL, url);
                activity.startActivity(intent);
            });
        }

        @android.webkit.JavascriptInterface
        public void home() {
            activity.runOnUiThread(activity::finish);
        }

        @android.webkit.JavascriptInterface
        public void ready() {
            if (onReady != null) {
                activity.runOnUiThread(onReady);
            }
        }

        @android.webkit.JavascriptInterface
        public void windowAction(String action, float x, float y) {
            // Native window dragging is meaningless inside a full-screen activity.
        }
    }

    /**
     * Android has no desktop file manager, so the two "open folder" buttons and
     * the project-folder icon are dead ends here. Quit becomes a native finish
     * instead of window.close(), which a WebView cannot honour.
     */
    private static final String ANDROID_SHELL_JS =
            "(function(){"
                    + "if(document.getElementById('neotodo-android-shell'))return;"
                    + "var style=document.createElement('style');"
                    + "style.id='neotodo-android-shell';"
                    + "style.textContent='[data-action=\"open-note-materials-folder\"],"
                    + "[data-action=\"open-sounds-folder\"]," + ".notes-icon-button{display:none !important}';"
                    + "document.head.appendChild(style);"
                    + "document.addEventListener('click',function(event){"
                    + "var target=event.target.closest&&event.target.closest('[data-action=\"quit-app\"]');"
                    + "if(target&&window.NeoTodoAndroid){event.preventDefault();event.stopPropagation();"
                    + "window.NeoTodoAndroid.home();}"
                    + "},true);"
                    + "})();";

    private final class ShellClient extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            Uri uri = request.getUrl();
            String scheme = uri.getScheme() == null ? "" : uri.getScheme().toLowerCase();
            String host = uri.getHost() == null ? "" : uri.getHost();

            // Fallback for shells which still navigate through the old iframe bridge.
            if ("neotodo.local".equals(host)) {
                if (bridge != null) {
                    bridge.onBridge(uri.getPath() == null ? "" : uri.getPath(), uri);
                }
                return true;
            }
            if ("http".equals(scheme) || "https".equals(scheme) || "mailto".equals(scheme)) {
                try {
                    activity.startActivity(new Intent(Intent.ACTION_VIEW, uri));
                } catch (ActivityNotFoundException error) {
                    Toast.makeText(activity, "No app can open this link", Toast.LENGTH_SHORT).show();
                }
                return true;
            }
            return false;
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            view.evaluateJavascript(ANDROID_SHELL_JS, null);
            Log.d(TAG, "page finished: " + url);
        }
    }

    private final class ShellChromeClient extends WebChromeClient {
        @Override
        public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback,
                                         FileChooserParams params) {
            if (pendingFiles != null) {
                pendingFiles.onReceiveValue(null);
            }
            pendingFiles = callback;
            try {
                Intent intent = params.createIntent();
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                activity.startActivityForResult(intent, FILE_CHOOSER_REQUEST);
                return true;
            } catch (Exception error) {
                Log.w(TAG, "file chooser failed", error);
                pendingFiles = null;
                return false;
            }
        }

        @Override
        public boolean onConsoleMessage(ConsoleMessage message) {
            Log.d(TAG, message.message() + " @" + message.lineNumber());
            return true;
        }
    }
}
