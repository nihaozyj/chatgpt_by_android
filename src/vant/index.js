import { Button, Field, Icon, NavBar, Tag, ActionSheet, Divider } from 'vant'

const components = [Button, NavBar, Field, Icon, Tag, ActionSheet, Divider]

export default function (app) {
  components.forEach(component => {
    app.use(component)
  })
}