import AVFoundation
import UIKit

@main
final class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // NeoTodo's sounds are part of the workspace, like the desktop build,
        // so they should not be muted by the ring/silent switch.
        let session = AVAudioSession.sharedInstance()
        try? session.setCategory(.playback, mode: .default, options: [.mixWithOthers])
        try? session.setActive(true)

        let window = UIWindow(frame: UIScreen.main.bounds)
        window.backgroundColor = Palette.paper
        window.rootViewController = WorkspaceViewController()
        window.makeKeyAndVisible()
        self.window = window
        return true
    }
}
