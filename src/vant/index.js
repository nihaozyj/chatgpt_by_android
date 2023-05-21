import { Button, Field, Icon, NavBar, Tag, ActionSheet } from 'vant'

const components = [Button, NavBar, Field, Icon, Tag, ActionSheet]

export default function (app) {
  components.forEach(component => {
    app.use(component)
  })
}