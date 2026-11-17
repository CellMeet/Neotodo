import UIKit
import WebKit

/// A detached note or AI panel, served by the same backend and presented as a
/// sheet. The grabber in the page docks it back with the `home` bridge; a
/// swipe down also closes it.
final class DetachedSheetController: UIViewController {
    private let url: URL
    private let configuration: WKWebViewConfiguration
    private var webView: WKWebView?

    init(url: URL, configuration: WKWebViewConfiguration) {
        self.url = url
        self.configuration = configuration
        super.init(nibName: nil, bundle: nil)
    }

    @available(*, unavailable)
    required init?(coder: NSCoder) {
        fatalError("init(coder:) is not used")
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = Palette.paper

        let webView = WebShell.webView(configuration: configuration)
        webView.navigationDelegate = self
        webView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(webView)
        NSLayoutConstraint.activate([
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.topAnchor.constraint(equalTo: view.topAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
        ])
        self.webView = webView
        webView.load(URLRequest(url: url))
    }
}

extension DetachedSheetController: WKNavigationDelegate {
    func webView(_ webView: WKWebView,
                 decidePolicyFor navigationAction: WKNavigationAction,
                 decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        guard let url = navigationAction.request.url else {
            decisionHandler(.allow)
            return
        }
        let scheme = url.scheme?.lowercased() ?? ""
        if url.host?.lowercased() == "neotodo.local" {
            decisionHandler(.cancel)
            if url.path == "/home" {
                dismiss(animated: true)
            }
            return
        }
        if scheme == "http" || scheme == "https" {
            if url.host?.lowercased() == "127.0.0.1" || url.host?.lowercased() == "localhost" {
                decisionHandler(.allow)
            } else {
                UIApplication.shared.open(url)
                decisionHandler(.cancel)
            }
            return
        }
        if scheme == "about" || scheme == "data" || scheme == "blob" {
            decisionHandler(.allow)
            return
        }
        if scheme == "mailto" || scheme == "tel" {
            UIApplication.shared.open(url)
        }
        decisionHandler(.cancel)
    }

    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
        webView.reload()
    }
}
