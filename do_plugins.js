//do_plugins.js

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadPlugins(pluginsDir) {
  const pluginFiles = await fs.readdir(pluginsDir);
  return Promise.all(
    pluginFiles.map(async (file) => {
      if (path.extname(file) === '.js') {
        const pluginPath = path.join(pluginsDir, file);
        return import(pluginPath);
      }
    })
  );
}

async function executePlugins(plugins) {
  const results = await Promise.all(
    plugins.map(async (plugin) => {
      if (plugin && typeof plugin.run === 'function') {
        try {
          return await plugin.run();
        } catch (error) {
          console.error(`Error executing plugin: ${error.message}`);
          return null;
        }
      }
    })
  );
  return results.filter(result => result !== null);
}

async function main() {
  const pluginsDir = path.join(__dirname, 'plugins');
  
  try {
    const plugins = await loadPlugins(pluginsDir);
    const results = await executePlugins(plugins);
    
    console.log('All plugins executed. Results:', results);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();