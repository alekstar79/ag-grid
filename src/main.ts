import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { ModuleRegistry } from 'ag-grid-community'
import { RangeSelectionModule } from '@ag-grid-enterprise/range-selection'
import 'ag-grid-enterprise'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

ModuleRegistry.registerModules([
  RangeSelectionModule
])

createApp(App)
  .use(router)
  .mount('#app')
