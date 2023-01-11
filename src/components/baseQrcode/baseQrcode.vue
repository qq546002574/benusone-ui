<<template>
  <div :id="uuid">
    <img :src="imgBase64" @load="imgLoad"/>
    <slot />
  </div>
</template>

<script>
import QRCode from "qrcode";
import html2canvas from "html2canvas";
export default {
  name: "bs-baseQrcode",
  components: {},
  props: {
    content: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      imgBase64: "",
      uuid: `base__qr_${this._uid}_code`, // 组件唯一ID
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  created() {
    this.init();
  },
  methods: {
    async init() {
      // 生成的
      // const canvas = document.getElementById('canvas')
      this.imgBase64 = await this.createQR(this.content);
    },
    createQR(content, options) {
      return new Promise((resolve, reject) => {
        QRCode.toDataURL(content, options).then((url) => {
          resolve(url);
        });
      });
    },
    createCanvas() {
      return new Promise((resolve, reject) => {
        const container = document.querySelector(`#${this.uuid}`);
        html2canvas(container).then((canvans) => {
          const base64 = canvans.toDataURL("image/png");
          resolve(base64);
        });
      });
    },
    // 画后的
    async imgLoad() {
      const canvansBase64 = await this.createCanvas();
      this.$emit("getImg", canvansBase64);
    },
  },
};
</script>
<style scoped>
</style>