import Money from './component.vue'
import VMoney from './directive'
import options from './options'

export {
  Money,
  VMoney,
  options
}

function install (Vue, globalOptions) {
  if (globalOptions) {
    Object.keys(globalOptions).map(function(key){
      options[key] = globalOptions[key]
    })
  }
  Vue.directive('money', VMoney)
  Vue.component('money', Money)
}

export default install

// Install by default if included from script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install)
}
