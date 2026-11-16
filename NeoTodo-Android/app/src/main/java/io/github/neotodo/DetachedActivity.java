package io.github.neotodo;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.widget.FrameLayout;

/** A detached note or AI sheet, opened from the workspace's long-press gesture. */
public class DetachedActivity extends Activity {

    static final String EXTRA_URL = "neotodo.url";

    private WebView webView;
    private WebViewSupport webSupport;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        String url = getIntent().getStringExtra(EXTRA_URL);
        if (url == null || !url.startsWith("http://127.0.0.1")) {
            finish();
            return;
        }

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(247, 239, 227));

        webView = new WebView(this);
        webSupport = new WebViewSupport(this, (path, uri) -> {
            if ("/home".equals(path)) {
                finish();
            } else if ("/open".equals(path)) {
                String target = uri.getQueryParameter("url");
                if (target != null) {
                    Intent intent = new Intent(this, DetachedActivity.class);
                    intent.putExtra(EXTRA_URL, target);
                    startActivity(intent);
                }
            }
        });
        webSupport.attach(webView);
        root.addView(webView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        WebViewSupport.handleImeInsets(root);
        setContentView(root);
        WebViewSupport.immersive(this);
        webView.loadUrl(url);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (webSupport != null && webSupport.onActivityResult(requestCode, resultCode, data)) {
            return;
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onBackPressed() {
        if (webView != null) {
            webView.evaluateJavascript(
                    "(function(){var e=new KeyboardEvent('keydown',{key:'Escape',code:'Escape',bubbles:true});"
                            + "document.dispatchEvent(e);window.dispatchEvent(e);})();", null);
        }
        finish();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }
}
