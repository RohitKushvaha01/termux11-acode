import plugin from '../plugin.json';

function removePrefix(str, prefix) {
    if (str.startsWith(prefix)) {
      return str.slice(prefix.length);
    }
    return str;
  }
  

const THIS_PLUGIN = removePrefix(`${PLUGIN_DIR}/x11`,"file://")

async function exec(cmd){
  return await Executor.BackgroundExecutor.execute(cmd,true)
}

class AcodePlugin {

  async init() {

    if(!await Terminal.isInstalled()) {
      acode.require("alert")("Termux11","Terminal is not installed or not working correctly.",()=>{})
      return
    }

    await exec("mkdir -p /opt",true)
    await exec(`cp -n ${THIS_PLUGIN}/base.apk /opt/base.apk`),true
    await exec("chmod -w /opt/base.apk",true)

    await exec(`cp -n ${THIS_PLUGIN}/termux-x11 /bin/termux-x11`,true)
    await exec(`chmod +x /bin/termux-x11`,true)

  }

  async destroy() {
    // plugin clean up
    await exec("rm -f /bin/termux-x11",true)
    await exec("rm -f /opt/base.apk",true)
  
  }
}

if (window.acode) {
  const acodePlugin = new AcodePlugin();
  acode.setPluginInit(plugin.id, async (baseUrl, $page, { cacheFileUrl, cacheFile }) => {
    if (!baseUrl.endsWith('/')) {
      baseUrl += '/';
    }
    acodePlugin.baseUrl = baseUrl;
    await acodePlugin.init($page, cacheFile, cacheFileUrl);
  });
  acode.setPluginUnmount(plugin.id, () => {
    acodePlugin.destroy();
  });
}
