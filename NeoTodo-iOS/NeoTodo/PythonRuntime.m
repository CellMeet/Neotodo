#import "PythonRuntime.h"

#import <UIKit/UIKit.h>

#include <Python/Python.h>

static NSString *_NeoTodoBackendError = nil;

static int NeoTodoFail(NSString *message) {
    _NeoTodoBackendError = [message copy];
    NSLog(@"[NeoTodo] %@", message);
    return -1;
}

NSString *_Nullable NeoTodoBackendError(void) {
    return _NeoTodoBackendError;
}

/// Opens a link with the system browser. `ios_server.py` installs this as
/// `native_open_url` before the backend starts handling requests.
static PyObject *NeoTodoOpenURL(PyObject *self, PyObject *args) {
    const char *link = NULL;
    if (!PyArg_ParseTuple(args, "s", &link)) {
        return NULL;
    }
    NSString *target = [NSString stringWithUTF8String:link ?: ""];
    if (target.length == 0) {
        PyErr_SetString(PyExc_ValueError, "Empty link");
        return NULL;
    }
    dispatch_async(dispatch_get_main_queue(), ^{
        NSURL *url = [NSURL URLWithString:target];
        if (url == nil) {
            return;
        }
        [[UIApplication sharedApplication] openURL:url options:@{} completionHandler:nil];
    });
    Py_RETURN_NONE;
}

static PyMethodDef NeoTodoOpenURLDef = {
    "native_open_url",
    NeoTodoOpenURL,
    METH_VARARGS,
    "Open a URL in the system browser (installed by the iOS shell).",
};

int NeoTodoStartPython(void) {
    @autoreleasepool {
        _NeoTodoBackendError = nil;

        NSFileManager *files = [NSFileManager defaultManager];
        NSString *resources = [[NSBundle mainBundle] resourcePath];
        NSString *pythonHome = [resources stringByAppendingPathComponent:@"python"];
        NSString *appPath = [resources stringByAppendingPathComponent:@"app"];

        if (![files fileExistsAtPath:pythonHome]) {
            return NeoTodoFail(@"The Python runtime is missing from the app bundle. "
                               @"Run Scripts/fetch-python.sh and rebuild.");
        }
        if (![files fileExistsAtPath:appPath]) {
            return NeoTodoFail(@"The NeoTodo backend is missing from the app bundle (app/).");
        }

        // Tasks, notes and settings live beside the app's own files, never in
        // the read-only bundle. app.py places its data next to Path.home().
        NSString *support = NSSearchPathForDirectoriesInDomains(
            NSApplicationSupportDirectory, NSUserDomainMask, YES).firstObject;
        if (support.length == 0) {
            return NeoTodoFail(@"The app container has no Application Support folder.");
        }
        [files createDirectoryAtPath:support withIntermediateDirectories:YES attributes:nil error:NULL];

        NSString *stdlib = nil;
        NSString *libRoot = [pythonHome stringByAppendingPathComponent:@"lib"];
        for (NSString *entry in [files contentsOfDirectoryAtPath:libRoot error:NULL]) {
            if ([entry hasPrefix:@"python3."]) {
                stdlib = [libRoot stringByAppendingPathComponent:entry];
                break;
            }
        }
        if (stdlib == nil) {
            stdlib = [libRoot stringByAppendingPathComponent:@"python3.13"];
        }
        NSString *dynload = [stdlib stringByAppendingPathComponent:@"lib-dynload"];

        setenv("PYTHONHOME", pythonHome.fileSystemRepresentation, 1);
        setenv("PYTHONPATH",
               [[@[appPath, stdlib, dynload] componentsJoinedByString:@":"]
                fileSystemRepresentation], 1);
        setenv("HOME", support.fileSystemRepresentation, 1);
        setenv("NEOTODO_IOS", "1", 1);
        setenv("PYTHONDONTWRITEBYTECODE", "1", 1);

        PyPreConfig preconfig;
        PyPreConfig_InitPythonConfig(&preconfig);
        preconfig.utf8_mode = 1;
        PyStatus status = Py_PreInitialize(&preconfig);
        if (PyStatus_Exception(status)) {
            return NeoTodoFail([NSString stringWithFormat:@"Python pre-init failed: %s",
                                status.err_msg ?: "unknown"]);
        }

        PyConfig config;
        PyConfig_InitPythonConfig(&config);
        config.buffered_stdio = 0;
        config.write_bytecode = 0;
        config.install_signal_handlers = 1;
#if PY_VERSION_HEX >= 0x030D0000
        config.use_system_logger = 1;
#endif
        config.parse_argv = 0;

        status = PyConfig_SetBytesString(&config, &config.home, pythonHome.fileSystemRepresentation);
        if (PyStatus_Exception(status)) {
            PyConfig_Clear(&config);
            return NeoTodoFail([NSString stringWithFormat:@"Python home could not be set: %s",
                                status.err_msg ?: "unknown"]);
        }

        status = Py_InitializeFromConfig(&config);
        PyConfig_Clear(&config);
        if (PyStatus_Exception(status)) {
            return NeoTodoFail([NSString stringWithFormat:@"Python could not start: %s",
                                status.err_msg ?: "unknown"]);
        }

        PyObject *module = PyImport_ImportModule("ios_server");
        if (module == NULL) {
            PyErr_Print();
            return NeoTodoFail(@"The iOS backend entry point (ios_server) could not be imported.");
        }

        PyObject *openURL = PyCFunction_New(&NeoTodoOpenURLDef, NULL);
        if (openURL != NULL) {
            PyObject_SetAttrString(module, "native_open_url", openURL);
            Py_DECREF(openURL);
        }

        PyObject *start = PyObject_GetAttrString(module, "start");
        Py_DECREF(module);
        if (start == NULL || !PyCallable_Check(start)) {
            Py_XDECREF(start);
            PyErr_Print();
            return NeoTodoFail(@"ios_server.start is missing.");
        }

        PyObject *result = PyObject_CallObject(start, NULL);
        Py_DECREF(start);
        if (result == NULL) {
            PyErr_Print();
            return NeoTodoFail(@"The NeoTodo backend failed to start.");
        }

        long port = PyLong_AsLong(result);
        Py_DECREF(result);
        if (port <= 0 || port > 65535) {
            PyErr_Print();
            return NeoTodoFail(@"The NeoTodo backend did not report a port.");
        }

        // Hand the interpreter to its own threads: UIKit keeps this thread
        // busy for the rest of the app's life, so the GIL must not stay here.
        PyEval_SaveThread();
        return (int)port;
    }
}
