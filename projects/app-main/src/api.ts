/**
 * The API to communicate between main and renderer thread.
 */
export interface API {
    sendToMain: (message: string) => void;
    onMainMessage: (handler: (message: string) => void) => void;
}

export interface CustomWindow {
    api: API;
}
