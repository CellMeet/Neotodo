import Foundation
import WebKit

/// Receives `window.webkit.messageHandlers.neotodo` messages from the page.
final class BridgeHandler: NSObject, WKScriptMessageHandler {
    typealias Callback = ([String: Any]) -> Void

    private let callback: Callback

    init(_ callback: @escaping Callback) {
        self.callback = callback
    }

    func userContentController(_ userContentController: WKUserContentController,
                               didReceive message: WKScriptMessage) {
        guard let body = message.body as? [String: Any] else { return }
        DispatchQueue.main.async {
            self.callback(body)
        }
    }
}

/// The bridge and configuration both web views (the workspace and a detached
/// note/AI sheet) share.
enum WebShell {
    /// The workspace is desktop-first and asks the native shell for the things
    /// a browser cannot do: pop a note/AI panel into its own surface, report
    /// the first painted frame, and open an external link.
    ///
    /// The Android shell exposes the same interface under `NeoTodoAndroid`, and
    /// the page already branches on that name for touch input (edge rails,
    /// hover fallbacks, `open`/`home`). Aliasing the two names lets the iOS
    /// shell reuse that branch without editing the shared `web/app.js`.
    static let bridgeScript = """
    (function () {
      if (window.NeoTodoIOS) { return; }
      function post(action, payload) {
        try {
          window.webkit.messageHandlers.neotodo.postMessage(
            Object.assign({ action: action }, payload || {})
          );
        } catch (error) {}
      }
      var shell = {
        open: function (url) { post("open", { url: url || "" }); },
        home: function () { post("home"); },
        windowAction: function (name, x, y) { post("window", { name: name, x: x, y: y }); },
        ready: function () { post("ready"); },
        openUrl: function (url) { post("open-url", { url: url || "" }); }
      };
      window.NeoTodoIOS = shell;
      window.NeoTodoAndroid = shell;

      // Remember what the next <input type="file"> wants so the native picker
      // can show Photos for pictures and Files for everything else.
      document.addEventListener("click", function (event) {
        var el = event.target;
        if (!el || el.tagName !== "INPUT" || el.type !== "file") { return; }
        post("file-picker", { accept: el.accept || "", multiple: !!el.multiple });
      }, true);
    })();
    """

    /// The page has its own context menu, so the long-press callout is turned
    /// off; text fields keep the native selection menu.
    static let styleScript = """
    (function () {
      var style = document.createElement("style");
      style.textContent = [
        "body{-webkit-touch-callout:none}",
        "input,textarea,[contenteditable='true']{-webkit-touch-callout:default;",
        "-webkit-user-select:text;user-select:text}"
      ].join("");
      (document.head || document.documentElement).appendChild(style);
    })();
    """

    static func configuration(bridge: BridgeHandler) -> WKWebViewConfiguration {
        let configuration = WKWebViewConfiguration()
        configuration.defaultWebpagePreferences.allowsContentJavaScript = true
        configuration.allowsInlineMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = []
        configuration.websiteDataStore = .default()

        let controller = WKUserContentController()
        controller.addUserScript(WKUserScript(source: bridgeScript,
                                              injectionTime: .atDocumentStart,
                                              forMainFrameOnly: false))
        controller.addUserScript(WKUserScript(source: styleScript,
                                              injectionTime: .atDocumentEnd,
                                              forMainFrameOnly: true))
        controller.add(bridge, name: "neotodo")
        configuration.userContentController = controller
        return configuration
    }

    static func webView(configuration: WKWebViewConfiguration) -> WKWebView {
        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.allowsBackForwardNavigationGestures = false
        webView.allowsLinkPreview = false
        webView.scrollView.bounces = false
        webView.scrollView.contentInsetAdjustmentBehavior = .always
        webView.isOpaque = false
        webView.backgroundColor = Palette.paper
        webView.scrollView.backgroundColor = Palette.paper
        webView.underPageBackgroundColor = Palette.paper
        return webView
    }

    /// A long press stands in for the desktop right-click. The drag gestures in
    /// the workspace move the pointer, which cancels the recognizer, so a held
    /// still finger is the only thing that opens a menu.
    static func contextMenuScript(x: CGFloat, y: CGFloat) -> String {
        let pointX = Int(x.rounded())
        let pointY = Int(y.rounded())
        return """
        (function () {
          var target = document.elementFromPoint(\(pointX), \(pointY)) || document.body;
          try {
            target.dispatchEvent(new PointerEvent("pointercancel", {
              bubbles: true, cancelable: true, pointerType: "touch",
              clientX: \(pointX), clientY: \(pointY)
            }));
          } catch (error) {}
          target.dispatchEvent(new MouseEvent("contextmenu", {
            bubbles: true, cancelable: true, view: window,
            clientX: \(pointX), clientY: \(pointY), button: 2
          }));
        })();
        """
    }
}
