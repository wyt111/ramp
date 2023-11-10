import Vue from "vue";

//ui - vant
import "vant/lib/index.css";
import {
  Icon,
  Loading,
  Field,
  Popup,
  List,
  RadioGroup,
  Radio,
  Checkbox,
  CheckboxGroup,
  Lazyload,
  Swipe,
  SwipeItem,
  ActionSheet,
  DatetimePicker,
  NoticeBar,
  Popover,
  Button,
} from "vant";
Vue.use(List);
Vue.use(Popup);
Vue.use(Field);
Vue.use(Icon);
Vue.use(Loading);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(ActionSheet);
Vue.use(DatetimePicker);
Vue.use(NoticeBar);
Vue.use(Popover);
Vue.use(Button);
Vue.use(Lazyload, {
  lazyComponent: true,
});
