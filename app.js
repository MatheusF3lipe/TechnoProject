const vm = new Vue({
  el: "#app",
  data: {
    produtos: [],
  },
  methods: {
    renderProducts() {
      fetch("./api/produtos.json").
      then(r => r.json()).
      then(r => {
        this.produtos = r;
      })
    }
  },
  created() {
    this.renderProducts();
  },
})