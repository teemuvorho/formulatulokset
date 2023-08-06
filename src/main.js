import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    name: 'F1 Results',
  },
});

export default app;
