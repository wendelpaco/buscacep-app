import { Controller } from "@hotwired/stimulus"
import { API_URL } from "../config"
import consumer from "../channels/consumer"

// Connects to data-controller="home"
export default class extends Controller {

  static targets = ["cepInput","cep","street","neighborhood", "cityState", "main", "error"]

  connect() {
    this.cepInputTarget.addEventListener("input", this.maskCep.bind(this))
    setTimeout(() => this.element.querySelector('.banner').style.display = 'flex', 300)

    this.channel = consumer.subscriptions.create("UserChannel", {
      received: (data) => console.log(`=> ${data.message}`)
    })

  }

  disconnect() {
    this.cepInputTarget.removeEventListener("input", this.maskCep.bind(this))
    this.subscription.unsubscribe()
  }

  onEnter(event){
    if(event.keyCode === 13){
      this.fetchAddressDataByCep()
    }
  }

  getCep(event){
    event.preventDefault()
    this.fetchAddressDataByCep()
  }

  async fetchAddressDataByCep(){
    if (this.cepInputTarget.value == "") 
      return;

    const response = await fetch(`${API_URL}/api/cep/v1/${this.cepInputTarget.value}`)
    const data = await response.json();

    if (response.status === 200){
      this.cepInputTarget.value = ""
      this.cepTarget.innerText = `${data.cep.slice(0, 5)}-${data.cep.slice(5)}`;
      this.streetTarget.innerText = data.street;
      this.neighborhoodTarget.innerText = data.neighborhood;
      this.cityStateTarget.innerText = `${data.city} - ${data.state}`
      this.mainTarget.classList.remove('hidden');
      this.errorTarget.classList.add('hidden');
    } else {
      this.errorTarget.innerHTML = `<p class="error-message">${data.message}</p>`;
      this.mainTarget.classList.remove('hidden');
    }
  }

  maskCep() {
    const CEP_LENGTH = 9;
    let cep = this.cepInputTarget.value;
    cep = cep.replace(/\D/g, "");
    cep = cep.replace(/^(\d{5})(\d)/, "$1-$2");
    this.cepInputTarget.value = cep;
    this.cepInputTarget.maxLength = cep.length === CEP_LENGTH ? cep.length : CEP_LENGTH;
  }
}
