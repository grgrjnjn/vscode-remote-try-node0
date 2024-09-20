//plugins/plugin_example1.js
export function run() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Example plugin 1 executed');
        resolve('Example plugin 1 result');
      }, 1000);
    });
  }
  