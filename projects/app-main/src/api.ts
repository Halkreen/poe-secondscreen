/**
 * The API to communicate between main and renderer thread.
 */
export interface API {
    // TODO: Define your own methods here! sendToMain() and onMainMessage() are just examples!
    sendToMain: (message: string) => void;
    onMainMessage: (handler: (message: string) => void) => void;
}

export interface CustomWindow {
    api: API;
}
