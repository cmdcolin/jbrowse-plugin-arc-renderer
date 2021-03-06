import Plugin from '@gmod/jbrowse-core/Plugin'
import PluginManager from '@gmod/jbrowse-core/PluginManager'

import ArcRenderer, {
  configSchema as ArcRendererConfigSchema,
  ReactComponent as ArcRendererReactComponent,
} from './ArcRenderer'

export default class ArcRendererPlugin extends Plugin {
  name = 'ArcPlugin'
  install(pluginManager: PluginManager) {
    pluginManager.addRendererType(
      () =>
        // @ts-ignore error "expected 0 arguments, but got 1"?
        new ArcRenderer({
          name: 'ArcRenderer',
          ReactComponent: ArcRendererReactComponent,
          configSchema: ArcRendererConfigSchema,
        }),
    )
  }
}
