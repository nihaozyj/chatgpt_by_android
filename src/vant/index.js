import {
  Button, Field, Icon, NavBar, Tag, Radio,
  ActionSheet, Divider, Empty, NoticeBar, Cell, Slider, Switch
} from 'vant'

const components = [
  Button, NavBar, Field, Icon, Tag, Radio,
  ActionSheet, Divider, Empty, NoticeBar, Cell, Slider, Switch
]

export default function (app) {
  components.forEach(component => {
    app.use(component)
  })
}