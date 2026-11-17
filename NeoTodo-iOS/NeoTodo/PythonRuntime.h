#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/// Starts the embedded CPython interpreter and the NeoTodo backend.
///
/// Must be called on the main thread once the loading screen is on screen. The
/// call returns the loopback port the backend listens on, or -1 when the
/// bundle is incomplete. It releases the GIL before returning, so the backend's
/// Python threads (the HTTP server and the agent store) keep running while
/// UIKit owns the main thread.
///
/// `NeoTodoBackendError()` describes the last failure for the loading screen.
int NeoTodoStartPython(void);

/// Human readable reason for the last `NeoTodoStartPython()` failure.
NSString *_Nullable NeoTodoBackendError(void);

NS_ASSUME_NONNULL_END
