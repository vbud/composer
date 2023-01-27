import localforage from 'localforage';

export const store = localforage.createInstance({
  name: 'composer',
  version: 1,
});

export const fileFramesStore = localforage.createInstance({
  name: 'composer_file-frames',
  version: 1,
});
