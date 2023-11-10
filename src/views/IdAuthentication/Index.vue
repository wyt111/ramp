<template>
  <div class="id-authentication-container">
    <component :is="currentComponentName"></component>
  </div>
</template>
<script>
import AuthenticationLoading from "./Authentication/Loading.vue";
import AuthenticationFailed from "./Authentication/Failed.vue";
import { getLegendQueryData } from "@/utils/publicRequest";

export default {
  name: "IdAuthentication",
  components: {
    AuthenticationLoading,
    AuthenticationFailed,
  },
  data() {
    return {
      timer: null,
      status: "",
      setRouterNameTimer: null,
    };
  },
  created() {
    this.status = this.$route.query.status;
    this.getLegendQueryData();
  },
  mounted() {},
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.setRouterNameTimer);
  },
  watch: {
    currentComponentName(componentName) {
      if (componentName === "AuthenticationLoading") {
        this.setNavRouterName("");
      } else if (componentName === "AuthenticationFailed") {
        this.setNavRouterName("nav.routerName_id_authentication");
      }
    },
  },
  methods: {
    setNavRouterName(str) {
      clearInterval(this.setRouterNameTimer);
      this.setRouterNameTimer = setInterval(() => {
        try {
          this.$parent.$refs.viewTab.routerName = str;
          clearInterval(this.setRouterNameTimer);
        } catch (e) {
          console.log(e);
        }
      }, 1);
    },
    async getLegendQueryData() {
      if (this.status != 4) {
        this.status = await getLegendQueryData();
        if (this.status == 3) {
          clearInterval(this.timer);
          this.$router.replace("/cashierDesk-bankTransfer");
        }
        clearInterval(this.timer);
        this.timer = setInterval(async () => {
          this.status = await getLegendQueryData();
          if (this.status == 3) {
            clearInterval(this.timer);
            this.$router.replace("/cashierDesk-bankTransfer");
          }
        }, 5000);
      }
    },
  },
  computed: {
    currentComponentName() {
      let currentComponentName = "AuthenticationLoading";
      switch (true) {
        case this.status == 2:
          currentComponentName = "AuthenticationLoading";
          break;
        case this.status == 4:
          currentComponentName = "AuthenticationFailed";
          break;
      }
      if (currentComponentName == "AuthenticationFailed") {
        clearInterval(this.timer);
      }
      return currentComponentName;
    },
  },
};
</script>
<style lang="scss" scoped>
.id-authentication-container {
  height: 100%;
}
</style>
