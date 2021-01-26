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

    const modal = document.querySelector('.modal')
    const btnClose = document.querySelector('.btn-close')
    const btnCancel = document.querySelector('.btn-cancel')
    const btnDeletar = document.querySelector('.deletar')
    
    modal.setAttribute('style', 'display:block;')
    
    btnClose.addEventListener('click', e => modal.setAttribute('style', 'display:none;'))
    btnCancel.addEventListener('click', e => modal.setAttribute('style', 'display:none;'))
    btnDeletar.addEventListener('click', e=>{
      const li = el.parentElement
      li.parentElement.remove()
      modal.setAttribute('style', 'display:none;')
      saveOnLocalStorage()
    })

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
  localStorage.setItem('bill', despesasJSON)
}

function createBill(texto){
  const li = createLiElement();
  const btnDelete = createDeleteButton();
  const btnPago = createPagoButton();
  const div = document.createElement('div');
  div.classList.add('options')

  li.setAttribute('class', 'liBill')
  li.innerText = texto;
   
  div.appendChild(btnPago);
  div.appendChild(btnDelete);

  li.appendChild(div);

  billList.appendChild(li)
  saveOnLocalStorage()
}

function createPagoButton(){
  const button = document.createElement('button')
  button.classList.add('pago');
  return button
}

function createDeleteButton(){
  const button = document.createElement('button')
  button.classList.add('delete');
  button.setAttribute('type', 'button')
  button.setAttribute('data-bs-toggle', 'modal')
  button.setAttribute('data-bs-target', 'ModalBox')
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