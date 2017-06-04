import SVG from '../svg.js'

const NATIVE = [
  'Image',
  'KeyboardAvoidingView',
  'ScrollView',
  'StyleSheet',
  'Text',
  'TextInput',
  'TouchableHighlight',
  'View',
]

export default (uses, getImport) => {
  const usesNative = []
  const usesSvg = []

  const dependencies = []
  uses.sort().forEach(d => {
    if (NATIVE.includes(d)) {
      usesNative.push(d)
    } else if (SVG.includes(d)) {
      usesSvg.push('SvgText' ? 'Text as SvgText' : d)
    } else if (/^[A-Z]/.test(d)) {
      dependencies.push(getImport(d))
    } else if (d === 'glam') {
      dependencies.push(`import css from 'glam'`)
    }
  })

  if (usesSvg.length > 0) {
    const svg = usesSvg.filter(m => m !== 'Svg').join(', ')
    dependencies.push(`import Svg, { ${svg} } from 'react-native-svg'`)
  }

  if (usesNative.length > 0) {
    dependencies.push(`import { ${usesNative.join(', ')} } from 'react-native'`)
  }

  return dependencies.join('\n')
}
