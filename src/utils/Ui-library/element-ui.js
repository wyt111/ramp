import Vue from "vue";

//注册全局组件 - components
import Button from "@/components/Button/Button.vue";
import ButtonLoading from "@/components/Button/ButtonLoading.vue";
import PoweredBy from "@/components/Powered/Index";
import CopyImg from "@/components/CopyImg/Index.vue";
import MerchantLogo from "@/components/MerchantLogo/Index.vue";
import NoticeBar from "@/components/NoticeBar/Index.vue";
import ImportantUpdates from "@/components/ImportantUpdates/Index.vue";
import BottomBar from "@/components/BottomBar/Index.vue";
import TraderInformation from "@/components/TraderInformation/Index.vue";
import { ContentLoader } from "vue-content-loader";
Vue.component("CustomButton", Button);
Vue.component("ButtonLoading", ButtonLoading);
Vue.component("PoweredBy", PoweredBy);
Vue.component("CopyImg", CopyImg);
Vue.component("MerchantLogo", MerchantLogo);
Vue.component("NoticeBar", NoticeBar);
Vue.component("ImportantUpdates", ImportantUpdates);
Vue.component("BottomBar", BottomBar);
Vue.component("ContentLoader", ContentLoader);
Vue.component("TraderInformation", TraderInformation);

//ui - element
import "element-ui/lib/theme-chalk/index.css";
import {
  Popover,
  InfiniteScroll,
  Checkbox,
  Radio,
  Tooltip,
  Upload,
} from "element-ui";
import CollapseTransition from "element-ui/lib/transitions/collapse-transition";
Vue.use(Popover);
Vue.use(InfiniteScroll);
Vue.use(Checkbox);
Vue.use(Radio);
Vue.use(Tooltip);
Vue.use(Upload);
Vue.component(CollapseTransition.name, CollapseTransition);
