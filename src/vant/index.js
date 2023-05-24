import {
  Button, Field, Icon, NavBar, Tag, Radio, TextEllipsis, Popup,
  ActionSheet, Divider, Empty, NoticeBar, Cell, Slider, Switch, CellGroup, Loading
} from 'vant'

const components = [
  Button, NavBar, Field, Icon, Tag, Radio, TextEllipsis, Popup,
  ActionSheet, Divider, Empty, NoticeBar, Cell, Slider, Switch, CellGroup, Loading
]

export default function (app) {
  components.forEach(component => {
    app.use(component)
  })
}