const vm = new Vue({
  el: "#app",
  data: {
    produtos: [],
    produto: false
  },
  filters: {
    numbersforPrice(valor) {
      return valor.toLocaleString("pt-BR",{style:"currency", currency:"BRL"} )
    },
  },
  methods: {
    renderProducts() {
      fetch("./api/produtos.json").
      then(r => r.json()).
      then(r => {
        this.produtos = r;
      })
    },
    renderproduct(id) {
      fetch(`./api/produtos/${id}/dados.json`).
      then(r => r.json()).
      then(r => {
        this.produto = r
      })
    },
    closeModal({ target, currentTarget }) {
      if(currentTarget === target) 
      this.produto = false
    }
  },
  created() {
    this.renderProducts();
  },
})