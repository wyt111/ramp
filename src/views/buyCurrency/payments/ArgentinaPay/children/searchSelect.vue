<template>
  <div class="searchSelect-container">
    <div class="searchSelect">
      <div class="left">
        <img
          src="https://alchemywalletdownload.oss-cn-hongkong.aliyuncs.com/alchemypay/crypto-images/searchIcon.svg"
          alt=""
        />
        <input
          type="text"
          v-model="searchVal"
          :placeholder="$t('ArgentinaPay.SelectBank')"
        />
      </div>
      <p class="right" @click="$parent.search_isShow = false">
        {{ $t("buyPayWay.cancel") }}
      </p>
    </div>
    <div class="bank-content">
      <div class="content">
        <div
          class="bank-line"
          v-for="(item, index) in searchSelectText"
          :key="index"
          @click="selsetItem(item)"
        >
          <!--          <div class="title">{{  item.bank_name.slice(0,item.bank_name.indexOf(' '))  }}  </div>-->
          <!--          <span> - </span> //.slice(item.bank_name.indexOf(' '),item.bank_name.length)-->
          <div class="con">{{ item.bank_name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "searchSelect",
  data() {
    return {
      //银行数据
      banckData: [
        {
          bank_id: "340",
          bank_name: "BACS BANCO DE CREDITO Y SECURITIZACION S",
          detail: "",
        },
        {
          bank_id: "017",
          bank_name: "BANCO BBVA ARGENTINA S.A.",
          detail: "BFRPARBA",
        },
        {
          bank_id: "426",
          bank_name: "BANCO BICA S.A.",
          detail: "BICAARBSXXX",
        },
        {
          bank_id: "336",
          bank_name: "BANCO BRADESCO ARGENTINA S.A.U.",
          detail: "BBDEARBA",
        },
        {
          bank_id: "331",
          bank_name: "BANCO CETELEM ARGENTINA S.A.",
          detail: "s",
        },
        {
          bank_id: "319",
          bank_name: "BANCO CMF S.A.",
          detail: "CMFBARBA",
        },
        {
          bank_id: "431",
          bank_name: "BANCO COINAG S.A.",
          detail: "CNIAARBR",
        },
        {
          bank_id: "389",
          bank_name: "BANCO COLUMBIA S.A.",
          detail: "CLLUARBA",
        },
        {
          bank_id: "299",
          bank_name: "BANCO COMAFI SOCIEDAD ANONIMA",
          detail: "QUILARBA",
        },
        {
          bank_id: "191",
          bank_name: "BANCO CREDICOOP COOPERATIVO LIMITADO",
          detail: "BCOOARBA",
        },
        {
          bank_id: "432",
          bank_name: "BANCO DE COMERCIO S.A.",
          detail: "MCFAARBA",
        },
        {
          bank_id: "094",
          bank_name: "BANCO DE CORRIENTES S.A.",
          detail: "BCORARBC",
        },
        {
          bank_id: "315",
          bank_name: "BANCO DE FORMOSA S.A.",
          detail: "BFSAARBF",
        },
        {
          bank_id: "007",
          bank_name: "BANCO DE GALICIA Y BUENOS AIRES S.A.U.",
          detail: "GABAARBA",
        },
        {
          bank_id: "300",
          bank_name: "BANCO DE INVERSION Y COMERCIO EXTERIOR S",
          detail: "BICXARBA",
        },
        {
          bank_id: "029",
          bank_name: "BANCO DE LA CIUDAD DE BUENOS AIRES",
          detail: "BACIARBA",
        },
        {
          bank_id: "011",
          bank_name: "BANCO DE LA NACION ARGENTINA",
          detail: "NACNARBA",
        },
        {
          bank_id: "093",
          bank_name: "BANCO DE LA PAMPA SOCIEDAD DE ECONOMÍA M",
          detail: "PAMPARBA",
        },
        {
          bank_id: "014",
          bank_name: "BANCO DE LA PROVINCIA DE BUENOS AIRES",
          detail: "PRBAARBA",
        },
        {
          bank_id: "020",
          bank_name: "BANCO DE LA PROVINCIA DE CORDOBA S.A.",
          detail: "CORDARBA",
        },
        {
          bank_id: "269",
          bank_name: "BANCO DE LA REPUBLICA ORIENTAL DEL URUGU",
          detail: "BROUARBA",
        },
        {
          bank_id: "045",
          bank_name: "BANCO DE SAN JUAN S.A.",
          detail: "BSJUARBJ",
        },
        {
          bank_id: "086",
          bank_name: "BANCO DE SANTA CRUZ S.A.",
          detail: "BPSCARBA",
        },
        {
          bank_id: "321",
          bank_name: "BANCO DE SANTIAGO DEL ESTERO S.A.",
          detail: "",
        },
        {
          bank_id: "332",
          bank_name: "BANCO DE SERVICIOS FINANCIEROS S.A.",
          detail: "FSERARB1",
        },
        {
          bank_id: "338",
          bank_name: "BANCO DE SERVICIOS Y TRANSACCIONES S.A.",
          detail: "BSTIARBA",
        },
        {
          bank_id: "198",
          bank_name: "BANCO DE VALORES S.A.",
          detail: "BAVAARBA",
        },
        {
          bank_id: "083",
          bank_name: "BANCO DEL CHUBUT S.A.",
          detail: "BPCHARBA",
        },
        {
          bank_id: "310",
          bank_name: "BANCO DEL SOL S.A.",
          detail: "",
        },
        {
          bank_id: "448",
          bank_name: "BANCO DINO S.A.",
          detail: "",
        },
        {
          bank_id: "044",
          bank_name: "BANCO HIPOTECARIO S.A.",
          detail: "BHIPARBA",
        },
        {
          bank_id: "322",
          bank_name: "BANCO INDUSTRIAL S.A.",
          detail: "NBIAARBA",
        },
        {
          bank_id: "147",
          bank_name: "BANCO INTERFINANZAS S.A.",
          detail: "BIINARBA",
        },
        {
          bank_id: "259",
          bank_name: "BANCO ITAU ARGENTINA S.A.",
          detail: "ITAUARBA",
        },
        {
          bank_id: "305",
          bank_name: "BANCO JULIO SOCIEDAD ANONIMA",
          detail: "BJULARBC",
        },
        {
          bank_id: "285",
          bank_name: "BANCO MACRO S.A.",
          detail: "BOSUARBA",
        },
        {
          bank_id: "254",
          bank_name: "BANCO MARIVA S.A.",
          detail: "MARIARBA",
        },
        {
          bank_id: "341",
          bank_name: "BANCO MASVENTAS S.A.",
          detail: "",
        },
        {
          bank_id: "281",
          bank_name: "BANCO MERIDIAN S.A.",
          detail: "BMRDARBA",
        },
        {
          bank_id: "065",
          bank_name: "BANCO MUNICIPAL DE ROSARIO",
          detail: "MUNRARBR",
        },
        {
          bank_id: "034",
          bank_name: "BANCO PATAGONIA S.A.",
          detail: "BSUDARBA",
        },
        {
          bank_id: "301",
          bank_name: "BANCO PIANO S.A.",
          detail: "BAPIARBA",
        },
        {
          bank_id: "268",
          bank_name: "BANCO PROVINCIA DE TIERRA DEL FUEGO",
          detail: "TTFAARBA",
        },
        {
          bank_id: "097",
          bank_name: "BANCO PROVINCIA DEL NEUQUÉN SOCIEDAD ANÓ",
          detail: "BPNEARBA",
        },
        {
          bank_id: "309",
          bank_name: "BANCO RIOJA SOCIEDAD ANONIMA UNIPERSONAL",
          detail: "",
        },
        {
          bank_id: "247",
          bank_name: "BANCO ROELA S.A.",
          detail: "ROEBARB10BA",
        },
        {
          bank_id: "277",
          bank_name: "BANCO SAENZ S.A.",
          detail: "BSAEARBA",
        },
        {
          bank_id: "435",
          bank_name: "BANCO SUCREDITO REGIONAL S.A.U.",
          detail: "",
        },
        {
          bank_id: "027",
          bank_name: "BANCO SUPERVIELLE S.A.",
          detail: "BSUPARBA",
        },
        {
          bank_id: "312",
          bank_name: "BANCO VOII S.A.",
          detail: "VOIBARBA",
        },
        {
          bank_id: "262",
          bank_name: "BANK OF AMERICA, NATIONAL ASSOCIATION",
          detail: "",
        },
        {
          bank_id: "515",
          bank_name: "BANK OF CHINA LIMITED SUCURSAL BUENOS AI",
          detail: "BKCHARBAXXX",
        },
        {
          bank_id: "266",
          bank_name: "BNP PARIBAS",
          detail: "BNPAARBA",
        },
        {
          bank_id: "143",
          bank_name: "BRUBANK S.A.U.",
          detail: "",
        },
        {
          bank_id: "016",
          bank_name: "CITIBANK N.A.",
          detail: "CITIARBA",
        },
        {
          bank_id: "077",
          bank_name: "COMPAÑIA FINANCIERA ARGENTINA S.A.",
          detail: "",
        },
        {
          bank_id: "090",
          bank_name: "CORDIAL COMPAÑÍA FINANCIERA S.A.",
          detail: "",
        },
        {
          bank_id: "203",
          bank_name: "CREDITO REGIONAL COMPAÑIA FINANCIERA S.A",
          detail: "",
        },
        {
          bank_id: "092",
          bank_name: "FCA COMPAÑIA FINANCIERA S.A.",
          detail: "",
        },
        {
          bank_id: "059",
          bank_name: "FORD CREDIT COMPAÑIA FINANCIERA S.A.",
          detail: "",
        },
        {
          bank_id: "093",
          bank_name: "GPAT COMPAÑIA FINANCIERA S.A.U.",
          detail: "",
        },
        {
          bank_id: "150",
          bank_name: "HSBC BANK ARGENTINA S.A.",
          detail: "BACOARBA",
        },
        {
          bank_id: "015",
          bank_name: "INDUSTRIAL AND COMMERCIAL BANK OF CHINA",
          detail: "ICBKARBA",
        },
        {
          bank_id: "096",
          bank_name: "JOHN DEERE CREDIT COMPAÑÍA FINANCIERA S.",
          detail: "",
        },
        {
          bank_id: "165",
          bank_name: "JPMORGAN CHASE BANK, NATIONAL ASSOCIATIO",
          detail: "CHASARBA",
        },
        {
          bank_id: "094",
          bank_name: "MERCEDES-BENZ COMPAÑÍA FINANCIERA ARGENT",
          detail: "",
        },
        {
          bank_id: "056",
          bank_name: "MONTEMAR COMPAÑIA FINANCIERA S.A.",
          detail: "MCFIARBMXXX",
        },
        {
          bank_id: "386",
          bank_name: "NUEVO BANCO DE ENTRE RÍOS S.A.",
          detail: "BERAARBA",
        },
        {
          bank_id: "330",
          bank_name: "NUEVO BANCO DE SANTA FE SOCIEDAD ANONIMA",
          detail: "BPSFARBA",
        },
        {
          bank_id: "311",
          bank_name: "NUEVO BANCO DEL CHACO S. A.",
          detail: "BACHARBA",
        },
        {
          bank_id: "098",
          bank_name: "PSA FINANCE ARGENTINA COMPAÑÍA FINANCIER",
          detail: "",
        },
        {
          bank_id: "339",
          bank_name: "RCI BANQUE S.A.",
          detail: "",
        },
        {
          bank_id: "415",
          bank_name: "REBANKING HOLDING SA.",
          detail: "",
        },
        {
          bank_id: "095",
          bank_name: "ROMBO COMPAÑÍA FINANCIERA S.A.",
          detail: "",
        },
        {
          bank_id: "099",
          bank_name: "TOYOTA COMPAÑÍA FINANCIERA DE ARGENTINA",
          detail: "",
        },
        {
          bank_id: "072",
          bank_name: "TRANSATLANTICA COMPAÑIA FINANCIERA S.A.",
          detail: "",
        },
        {
          bank_id: "088",
          bank_name: "VOLKSWAGEN FINANCIAL SERVICES COMPAÑIA F",
          detail: "",
        },
        {
          bank_id: "384",
          bank_name: "WILOBANK S.A.",
          detail: "",
        },
      ],
      searchVal: "",
    };
  },
  //搜索
  computed: {
    searchSelectText() {
      if (this.searchVal) {
        return this.banckData.filter((item) => {
          if (item.bank_name.includes(this.searchVal.toUpperCase())) {
            return item;
          }
        });
      } else {
        return this.banckData;
      }
    },
  },
  methods: {
    selsetItem(val) {
      this.$parent.search_isShow = false;
      this.$parent.backName = val.bank_name;
      this.$parent.formError.backName = false;
    },
  },
};
</script>

<style scoped lang="scss">
.searchSelect-container {
  width: 100%;
  height: 100%;
  background: #fff;
  font-family: Regular;
  position: absolute;
  left: 0;
  top: 0;
  padding: 0.4rem 0.3rem 0.3rem;
  overflow: hidden;
  .searchSelect {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      width: 2.54rem;
      height: 0.58rem;
      border: 1px solid #0059da;
      border-radius: 0.29rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f4f5f7;
      img {
        height: 0.16rem;
        margin-left: 0.16rem;
      }
      input {
        width: 100%;
        height: 100%;
        font-size: 0.16rem;
        font-family: Regular;
        font-weight: 400;
        padding: 0 0.08rem;
        background: #f7f8fa;
        border-radius: 10px;
        outline: none;
        border: none;
        color: #6e7687;
        border-radius: 0.28rem;
      }
      input::placeholder {
        color: #bfbfbf;
      }
    }
    .right {
      height: 0.5rem;
      line-height: 0.5rem;
      color: #0059da;
      cursor: pointer;
    }
  }
  .bank-content {
    height: 85%;
    margin-top: 0.24rem;
    overflow-y: scroll;
    .bank-line {
      display: flex;
      flex-wrap: nowrap;
      margin-bottom: 0.24rem;
      cursor: pointer;
      color: #6e7687;
      span {
        margin: 0 0.02rem 0;
      }
      .title {
        font-family: Regular;
      }
      .con {
        width: 80%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .bank-line:hover {
      .con {
        width: auto;
      }
    }
  }
}
</style>
