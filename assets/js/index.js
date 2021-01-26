const billList = document.querySelector('.bill-list')
const addBill = document.querySelector('.add-bill')
const bill = document.querySelector('#bill');

document.addEventListener('click', e =>{
  const el = e.target;

  if(el.classList.contains('liBill')){
    if(el.classList.contains('done')){
      return el.classList.remove('done')
    }
    el.classList.add('done')
  }

  if(el.classList.contains('delete')){
    el.parentElement.remove()
    saveOnLocalStorage()
  }
})

addBill.addEventListener('click', e => {
  e.preventDefault()

  if(bill.value === '' || bill.value.lenght > 100) return
  createBill(bill.value)
  bill.value = ''
})

function saveOnLocalStorage(){
  const liDespesas= document.querySelectorAll('li')
  const listaDeDespesas = []

  for(let despesa of liDespesas){
    const text = despesa.innerText
    listaDeDespesas.push(text)
  }

  const despesasJSON = JSON.stringify(listaDeDespesas)
  localStorage.setItem('tarefas', despesasJSON)
}

function createBill(texto){
  const li = createLiElement();
  const button = createDeleteButton();
  li.setAttribute('class', 'liBill')
  li.innerText = texto;
  li.appendChild(button)
  billList.appendChild(li)
  saveOnLocalStorage()
}

function createDeleteButton(){
  const button = document.createElement('button')
  button.classList.add('delete');
  return button
}

function createLiElement(){
  return document.createElement('li');
}

function getFromLocalStorage(){
  const billsJSON = localStorage.getItem('tarefas')
  const bills = JSON.parse(billsJSON);

  for(let bill of bills){
    createBill(bill)
  }
}

getFromLocalStorage()