const plugins = [
  //elment-ui按需引入
  [
    "component",
    {
      libraryName: "element-ui",
      styleLibraryName: "theme-chalk",
    },
  ],
  //vant按需引入
  [
    "import",
    {
      libraryName: "vant",
      libraryDirectory: "es",
      style: true,
    },
    "vant",
  ],
];
//移除console
// if(process.env.NODE_ENV === 'production') {
//   plugins.push("transform-remove-console");
// }

module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: plugins,
};
