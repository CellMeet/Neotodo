import PhotosUI
import UIKit
import UniformTypeIdentifiers
import WebKit

/// The one window of the iOS app: the shared workspace served from the
/// embedded backend, plus the native pieces the page cannot do itself.
final class WorkspaceViewController: UIViewController {
    private let loading = LoadingView()
    private var webView: WKWebView?
    private var bridge: BridgeHandler?
    private var port: Int = 0
    private var revealed = false
    private var revealFallback: DispatchWorkItem?
    private var pendingOpenPanel: (([URL]?) -> Void)?
    private var pendingPhotoPicker: (([URL]?) -> Void)?
    private var pendingFileAccept = ""
    private var startedBackend = false

    override var prefersStatusBarHidden: Bool { true }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = Palette.paper
        loading.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(loading)
        NSLayoutConstraint.activate([
            loading.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            loading.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            loading.topAnchor.constraint(equalTo: view.topAnchor),
            loading.bottomAnchor.constraint(equalTo: view.bottomAnchor),
        ])
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        guard !startedBackend else { return }
        startedBackend = true
        // The loading screen paints first; the interpreter imports the backend
        // on this thread in the next run loop turn.
        DispatchQueue.main.async { [weak self] in
            self?.startBackend()
        }
    }

    // MARK: - Startup

    private func startBackend() {
        let started = NeoTodoStartPython()
        guard started > 0 else {
            loading.showFailure(NeoTodoBackendError() ?? "The NeoTodo backend did not start.")
            return
        }
        port = Int(started)
        installWebView()
    }

    private func installWebView() {
        let handler = BridgeHandler { [weak self] message in
            self?.handle(message)
        }
        bridge = handler

        let webView = WebShell.webView(configuration: WebShell.configuration(bridge: handler))
        webView.navigationDelegate = self
        webView.uiDelegate = self
        webView.alpha = 0
        webView.translatesAutoresizingMaskIntoConstraints = false
        view.insertSubview(webView, belowSubview: loading)
        NSLayoutConstraint.activate([
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.topAnchor.constraint(equalTo: view.topAnchor),
            webView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
        ])
        self.webView = webView

        let press = UILongPressGestureRecognizer(target: self, action: #selector(handleLongPress(_:)))
        press.minimumPressDuration = 0.45
        press.allowableMovement = 6
        press.cancelsTouchesInView = false
        webView.addGestureRecognizer(press)

        guard let url = URL(string: "http://127.0.0.1:\(port)/") else { return }
        webView.load(URLRequest(url: url))

        // The page reports `app-painted` through the bridge; this keeps a
        // script error from trapping the reader behind the loading screen.
        let fallback = DispatchWorkItem { [weak self] in
            self?.revealWorkspace()
        }
        revealFallback = fallback
        DispatchQueue.main.asyncAfter(deadline: .now() + 8, execute: fallback)
    }

    private func revealWorkspace() {
        guard !revealed else { return }
        revealed = true
        revealFallback?.cancel()
        revealFallback = nil
        webView?.alpha = 1
        UIView.animate(withDuration: 0.22, animations: { [weak self] in
            self?.loading.alpha = 0
        }, completion: { [weak self] _ in
            self?.loading.isHidden = true
            self?.loading.removeFromSuperview()
        })
    }

    // MARK: - Bridge

    private func handle(_ message: [String: Any]) {
        switch message["action"] as? String {
        case "ready":
            revealWorkspace()
        case "open":
            if let raw = message["url"] as? String {
                presentDetached(raw)
            }
        case "home":
            dismissDetached()
        case "open-url":
            if let raw = message["url"] as? String, let url = URL(string: raw) {
                UIApplication.shared.open(url)
            }
        case "file-picker":
            pendingFileAccept = message["accept"] as? String ?? ""
        default:
            break
        }
    }

    private func handleBridgeURL(_ url: URL) {
        let query = URLComponents(url: url, resolvingAgainstBaseURL: false)?.queryItems ?? []
        func value(_ name: String) -> String? {
            query.first(where: { $0.name == name })?.value
        }
        switch url.path {
        case "/open":
            if let target = value("url") {
                presentDetached(target)
            }
        case "/home":
            dismissDetached()
        default:
            break
        }
    }

    private func presentDetached(_ raw: String) {
        guard let url = URL(string: raw), isLocal(url), presentedViewController == nil else { return }
        let handler = BridgeHandler { [weak self] message in
            switch message["action"] as? String {
            case "home":
                self?.dismissDetached()
            case "open-url":
                if let raw = message["url"] as? String, let target = URL(string: raw) {
                    UIApplication.shared.open(target)
                }
            default:
                break
            }
        }
        let sheet = DetachedSheetController(url: url,
                                            configuration: WebShell.configuration(bridge: handler))
        sheet.modalPresentationStyle = UIDevice.current.userInterfaceIdiom == .pad ? .formSheet : .pageSheet
        present(sheet, animated: true)
    }

    private func dismissDetached() {
        guard presentedViewController != nil else { return }
        dismiss(animated: true)
    }

    private func isLocal(_ url: URL) -> Bool {
        guard let host = url.host?.lowercased() else { return false }
        return host == "127.0.0.1" || host == "localhost"
    }

    // MARK: - Touch

    @objc private func handleLongPress(_ gesture: UILongPressGestureRecognizer) {
        guard gesture.state == .began, let webView = webView else { return }
        let point = gesture.location(in: webView)
        let insets = webView.scrollView.adjustedContentInset
        let scale = max(webView.scrollView.zoomScale, 0.01)
        // `elementFromPoint` wants viewport coordinates, so undo the safe-area
        // inset and any pinch zoom; the scroll offset does not apply.
        let x = (point.x - insets.left) / scale
        let y = (point.y - insets.top) / scale
        webView.evaluateJavaScript(WebShell.contextMenuScript(x: x, y: y),
                                   completionHandler: nil)
    }

    // MARK: - Dialogs

    private func topPresenter() -> UIViewController? {
        var controller: UIViewController? = self
        while let presented = controller?.presentedViewController {
            controller = presented
        }
        return controller
    }

    private func startPhotoPicker(multiple: Bool, completion: @escaping ([URL]?) -> Void) {
        var configuration = PHPickerConfiguration()
        configuration.filter = .any(of: [.images, .videos])
        configuration.selectionLimit = multiple ? 0 : 1
        configuration.preferredAssetRepresentationMode = .current
        let picker = PHPickerViewController(configuration: configuration)
        picker.delegate = self
        pendingPhotoPicker = completion
        topPresenter()?.present(picker, animated: true)
    }

    private final class URLBox {
        var urls: [URL] = []
    }

    /// Copies the picked pictures/videos out of the item providers. The
    /// temporary file a provider hands over only lives for the callback, so it
    /// is copied into the app container before the page sees it.
    private func copyPhotos(_ results: [PHPickerResult], into box: URLBox, done: @escaping ([URL]) -> Void) {
        guard let result = results.first else {
            done(box.urls)
            return
        }
        let provider = result.itemProvider
        let type = provider.registeredTypeIdentifiers.first(where: {
            UTType($0)?.conforms(to: .image) == true
        }) ?? provider.registeredTypeIdentifiers.first(where: {
            UTType($0)?.conforms(to: .movie) == true
        })
        guard let type = type else {
            copyPhotos(Array(results.dropFirst()), into: box, done: done)
            return
        }
        provider.loadFileRepresentation(forTypeIdentifier: type) { [weak self] url, _ in
            var copy: URL?
            if let url = url {
                let ext = url.pathExtension.isEmpty ? "dat" : url.pathExtension
                let destination = FileManager.default.temporaryDirectory
                    .appendingPathComponent("neotodo-\(UUID().uuidString).\(ext)")
                if (try? FileManager.default.copyItem(at: url, to: destination)) != nil {
                    copy = destination
                }
            }
            DispatchQueue.main.async {
                if let copy = copy {
                    box.urls.append(copy)
                }
                self?.copyPhotos(Array(results.dropFirst()), into: box, done: done)
            }
        }
    }
}

// MARK: - Navigation

extension WorkspaceViewController: WKNavigationDelegate {
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
            handleBridgeURL(url)
            return
        }

        if scheme == "http" || scheme == "https" {
            if isLocal(url) {
                if navigationAction.targetFrame == nil {
                    // target="_blank" links stay in the workspace instead of
                    // opening a second, chrome-less window.
                    DispatchQueue.main.async { webView.load(navigationAction.request) }
                    decisionHandler(.cancel)
                } else {
                    decisionHandler(.allow)
                }
                return
            }
            UIApplication.shared.open(url)
            decisionHandler(.cancel)
            return
        }

        if scheme == "about" || scheme == "data" || scheme == "blob" {
            decisionHandler(.allow)
            return
        }

        if scheme == "mailto" || scheme == "tel" {
            UIApplication.shared.open(url)
            decisionHandler(.cancel)
            return
        }

        decisionHandler(.cancel)
    }

    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
        // A killed WebContent process leaves a blank page; reload the workspace.
        guard port > 0 else { return }
        webView.reload()
    }
}

// MARK: - JS panels and file inputs

extension WorkspaceViewController: WKUIDelegate {
    func webView(_ webView: WKWebView,
                 runJavaScriptAlertPanelWithMessage message: String,
                 initiatedByFrame frame: WKFrameInfo,
                 completionHandler: @escaping () -> Void) {
        let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler() })
        topPresenter()?.present(alert, animated: true)
    }

    func webView(_ webView: WKWebView,
                 runJavaScriptConfirmPanelWithMessage message: String,
                 initiatedByFrame frame: WKFrameInfo,
                 completionHandler: @escaping (Bool) -> Void) {
        let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel) { _ in completionHandler(false) })
        alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler(true) })
        topPresenter()?.present(alert, animated: true)
    }

    func webView(_ webView: WKWebView,
                 runJavaScriptTextInputPanelWithPrompt prompt: String,
                 defaultText: String?,
                 initiatedByFrame frame: WKFrameInfo,
                 completionHandler: @escaping (String?) -> Void) {
        let alert = UIAlertController(title: nil, message: prompt, preferredStyle: .alert)
        alert.addTextField { field in field.text = defaultText }
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel) { _ in completionHandler(nil) })
        alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
            completionHandler(alert.textFields?.first?.text)
        })
        topPresenter()?.present(alert, animated: true)
    }

    func webView(_ webView: WKWebView,
                 runOpenPanelWith parameters: WKOpenPanelParameters,
                 initiatedByFrame frame: WKFrameInfo,
                 completionHandler: @escaping ([URL]?) -> Void) {
        let acceptsPictures = pendingFileAccept.contains("image")
            || pendingFileAccept.contains("video")
        if acceptsPictures {
            startPhotoPicker(multiple: parameters.allowsMultipleSelection) { urls in
                completionHandler(urls)
            }
            return
        }

        pendingOpenPanel = completionHandler
        let picker = UIDocumentPickerViewController(forOpeningContentTypes: [.audio, .data],
                                                    asCopy: true)
        picker.allowsMultipleSelection = parameters.allowsMultipleSelection
        picker.delegate = self
        topPresenter()?.present(picker, animated: true)
    }
}

extension WorkspaceViewController: UIDocumentPickerDelegate {
    func documentPicker(_ controller: UIDocumentPickerViewController,
                        didPickDocumentsAt urls: [URL]) {
        pendingOpenPanel?(urls)
        pendingOpenPanel = nil
    }

    func documentPickerWasCancelled(_ controller: UIDocumentPickerViewController) {
        pendingOpenPanel?(nil)
        pendingOpenPanel = nil
    }
}

extension WorkspaceViewController: PHPickerViewControllerDelegate {
    func picker(_ picker: PHPickerViewController, didFinishPicking results: [PHPickerResult]) {
        picker.dismiss(animated: true)
        guard let completion = pendingPhotoPicker else { return }
        pendingPhotoPicker = nil
        guard !results.isEmpty else {
            completion(nil)
            return
        }
        let box = URLBox()
        copyPhotos(results, into: box) { urls in
            completion(urls.isEmpty ? nil : urls)
        }
    }
}
