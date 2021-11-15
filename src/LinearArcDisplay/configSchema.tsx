import PluginManager from '@jbrowse/core/PluginManager'
import { ConfigurationSchema } from '@jbrowse/core/configuration'

export function configSchemaFactory(pluginManager: PluginManager) {
  const LGVPlugin = pluginManager.getPlugin(
    'LinearGenomeViewPlugin',
  ) as import('@jbrowse/plugin-linear-genome-view').default
  //@ts-ignore
  const { baseLinearDisplayConfigSchema } = LGVPlugin.exports
  return ConfigurationSchema(
    'LinearArcDisplay',
    { renderer: pluginManager.pluggableConfigSchemaType('renderer') },
    {
      baseConfiguration: baseLinearDisplayConfigSchema,
      explicitlyTyped: true,
    },
  )
}
