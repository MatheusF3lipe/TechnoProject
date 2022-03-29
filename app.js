const vm = new Vue({
  el: "#app",
  data: {
    produtos: [],
    produto: false,
    compras: [],
    mensagem: '',
    alertaAtivo: false,
    carrinhoAtivo: false
  },
  filters: {
    numbersforPrice(valor) {
      return valor.toLocaleString("pt-BR",{style:"currency", currency:"BRL"} )
    },
  },
  computed: {
    carrinho() {
      let contador = 0
      if(this.compras.length) {
        this.compras.forEach(item => {
          contador += item.preco
        })
      }
      return contador
    }
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
    openModal(id) {
      this.renderproduct(id)
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    },
    closeModal({ target, currentTarget }) {
      if(currentTarget === target) 
      this.produto = false
    },
    closeCarrinho({target, currentTarget}) {
      if(currentTarget === target)
      this.carrinhoAtivo = false
    }, 
    pushProduct() {
    this.produto.estoque--
    const {id,preco,nome} = this.produto
    this.compras.push({id,nome,preco})
    this.openMessage(`${nome} foi somado ao carrinho`)
    },
    removeritem(index){
      this.compras.splice(index, 1)
      console.log({index})
    },
    checkarValorLocalStorage(){
      if(window.localStorage.compras) {
        this.compras = JSON.parse(window.localStorage.compras)
      }
    },
    openMessage(mensagem) {
      this.mensagem = mensagem
      this.alertaAtivo = true
      setTimeout(() => {
        this.alertaAtivo = false
      }, 1500)
    },
    router() {
      const hash = document.location.hash
      console.log(hash)
      if(hash) {
      this.renderproduct(hash.replace('#',''))
      }
    },
    compararEstoque() {
     const itens = this.compras.filter(item => {
        console.log(item)
        if(item.id === this.produto.id) {
          return true
        }
      })
      this.produto.estoque = this.produto.estoque - itens.length
      console.log(itens)
    }
},
  created() {
    this.renderProducts();
    this.checkarValorLocalStorage();
    this.router()
  },
  watch: {
    carrinho () {
      window.localStorage.compras = JSON.stringify(this.compras)
      console.log('Adicionou algo ao localStorage')
    },
    produto() {
      document.title = this.produto.nome || "Techno Project"
      const hash = this.produto.id || ''
      history.pushState(null, null, `#${hash}`)
      if(this.produto)  {
      this.compararEstoque()
      }
    }
  }
})