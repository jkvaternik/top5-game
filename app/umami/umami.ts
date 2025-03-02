export const emitEvent = (name: string, data?: object) => {
  if (window.umami) {
    window.umami.track(name, data);
  }
};
