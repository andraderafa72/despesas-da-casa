const billList = document.querySelector('.table-bills')
const addBill = document.querySelector('.add-bill')
const bill = document.querySelector('#bill');
const billValue = document.querySelector('#valor');

isNumber = (n) => !isNaN(parseFloat(n)) && isFinite(n)

document.addEventListener('keypress', e =>{
  if(e.key === 'Enter'){
    startApp()
  }  
})

addBill.addEventListener('click', e => {
  e.preventDefault()
  startApp()
})

document.addEventListener('click', e =>{
  const el = e.target;

  if(el.classList.contains('pago')){
    const td = el.parentElement
    const tr = td.parentElement
    if(tr.classList.contains('done')){
      tr.classList.remove('done')
      createResultsTableElement()
      return
    }
    tr.classList.add('done')  
    createResultsTableElement()

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

function startApp(){
  if(!isNumber(billValue.value) || bill.value === '') return
  if(bill.value === '' || bill.value.lenght > 100) return
  
  createBill(bill.value, billValue.value)
  bill.value = ''
  billValue.value = ''
}

function saveOnLocalStorage(){
  const despesasTr= document.querySelectorAll('.trBill')
  const listaDeDespesas = []
  
  for(let despesa of despesasTr){
    const id = despesa.querySelector('.td-id').innerText
    const valor = despesa.querySelector('.td-valor').innerText

    const valorSemMoeda = valor.replace('R$', '')
    
    listaDeDespesas.push({id, valor:valorSemMoeda})
  }
  const despesasJSON = JSON.stringify(listaDeDespesas)
  localStorage.setItem('bill', despesasJSON)
}

// INCREMENTAÇÃO NA TABELA
function createBill(texto, valor){
  const btnDelete = createDeleteButton();
  const btnPago = createPagoButton();
  const tr = createTrBillElement();
  const tdId = createTdIdElement();
  const tdValor = createTdValorElement();
  const tdButtons = createTdButtonsElement();
  
  tdId.innerText = texto
  tdValor.innerText = `R$ ${valor}` 
  tdButtons.appendChild(btnPago)
  tdButtons.appendChild(btnDelete)
  
  tr.appendChild(tdId)
  tr.appendChild(tdValor)
  tr.appendChild(tdButtons)
  billList.appendChild(tr)

  saveOnLocalStorage()
  if(localStorage.getItem('bill')) createResultsTableElement()
}

// ELEMENTOS DAS TABELAS
createResultsTableElement = () => {
  const checkTable = document.querySelector('.results')
  if(checkTable) checkTable.remove()

  const container = document.querySelector('.container')

  const table = document.createElement('table')
  table.classList.add('results')
  
  const trTitles = createTrElement();
  const thTotal = createThElement();
  thTotal.innerText = 'Total'
  const thPago = createThElement();
  thPago.innerText = 'Total Pago'
  const thRestante = createThElement();
  thRestante.innerText = 'Pendente'
  
  const trResults = createTrElement();
  const tdTotal = createTdElement();
  const tdPago = createTdElement();
  const tdRestante = createTdElement();

  tdTotal.innerText = calcularTotalDeDespesas().toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
  tdPago.innerText = calcularTotalDeDespesasPagas().toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
  tdRestante.innerText = calcularTotalDeDespesasPendentes().toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});

  trTitles.appendChild(thTotal)
  trTitles.appendChild(thPago)
  trTitles.appendChild(thRestante)

  trResults.appendChild(tdTotal)
  trResults.appendChild(tdPago)
  trResults.appendChild(tdRestante)

  table.appendChild(trTitles)
  table.appendChild(trResults)

  container.appendChild(table)
}

createThElement = () => document.createElement('th')

createTdElement = () => document.createElement('td')

createTrElement= () => document.createElement('tr')

createTdIdElement = e => {
  const td = createTdElement();
  td.classList.add('td-id');
  return td;
}

createTdValorElement = e => {
  const td = createTdElement();
  td.classList.add('td-valor');
  return td;
}

createTdButtonsElement = e => {
  const td = createTdElement();
  td.classList.add('td-buttons');
  return td;
}

createTrBillElement = e => {
  const tr = createTrElement();
  tr.classList.add('trBill');
  return tr;
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

// OPERAÇÕES DAS DESPESAS
calcularTotalDeDespesasPagas = () => {
  const pagos = document.querySelectorAll('.done .td-valor');
  let acumulador = [0]

  for (let pago of pagos) {
    const pagoSemMoeda = pago.innerText.replace('R$ ', '')
    acumulador.push(pagoSemMoeda)
  }
  
  return acumulador.reduce((ac, value) => Number(ac) + Number(value));
}

calcularTotalDeDespesasPendentes = () => {
  const total = calcularTotalDeDespesas()
  const pagos = calcularTotalDeDespesasPagas()

  return total - pagos
}

calcularTotalDeDespesas = () => {
  const billsJSON = localStorage.getItem('bill')
  const bills = JSON.parse(billsJSON);
  let acumulador = [0]

  for (let bill of bills) {
    acumulador.push(bill.valor)
  }
  
  return acumulador.reduce((ac, value) => Number(ac) + Number(value));
}

// REQUISIÇÃO NO LOCALSTORAGE
function getFromLocalStorage(){
  const billsJSON = localStorage.getItem('bill')
  const bills = JSON.parse(billsJSON);

  for (let bill of bills) {
    createBill(bill.id, bill.valor)
  }
}

createResultsTableElement()
getFromLocalStorage()