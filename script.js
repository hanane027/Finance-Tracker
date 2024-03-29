const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const formatter = new Intl.NumberFormat('en-US', {
  style: "currency",
  currency: "USD",
  signDisplay: "always",
})


const list = document.getElementById("transactionList");
const form = document.getElementById("transactionForm");
const status = document.getElementById("status");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

form.addEventListener('submit', addTransaction);

function updateTotal(){
const incomeTotal = transactions
  .filter(trx => trx.type === 'income')
  .reduce((total, trx) => total + trx.amount, 0);

const expenseTotal = transactions
  .filter(trx => trx.type === 'expense')
  .reduce((total, trx) => total + trx.amount, 0);

  const balanceTotal = incomeTotal - expenseTotal;

  balance.textContent = formatter.format(balanceTotal).substring(1);
  income.textContent = formatter.format(incomeTotal);
  expense.textContent = formatter.format(expenseTotal * -1);
}

function renderList(){
  list.innerHTML = "";

  status.textContent = "";

  if(transactions.length === 0){
    status.textContent = 'No transactions.';
    return;
  }

  transactions.forEach(({ id, name, amount, date, type}) => {
    const sign = 'income' === type ? 1 : -1;


    const li = document.createElement("li");

    li.innerHTML = `
    <div class="name">
      <h4>${name}</h4>
      <p>${new Date(date).toLocaleDateString()}</p>
    </div>

    <div class="amount ${type}">
      <span>${formatter.format(amount * sign)}</span>
    </div>

    <div class="action">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"    stroke-width="1.5" stroke="currentColor" onclick="deleteTransaction(${id})">
         <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />  
      </svg>
  
    </div>

    `;

    list.appendChild(li);

  })
}

renderList();
updateTotal();

function deleteTransaction(id){
  const index = transactions.findIndex((trx) => trx.id === id);
  transactions.splice(index, 1);

  updateTotal();
  saveTransactions();
  renderList();
}

function addTransaction(e){
  e.preventDefault();

  const formData = new FormData(this);

  transactions.push({
    id: transactions.length + 1,
    name: formData.get("name"),
    amount: parseFloat(formData.get("amount")),
    date: new Date(formData.get("date")),
    type: 'on' === formData.get("type") ? "income" : "expense",
  });

  this.reset();

  updateTotal();
  saveTransactions();
  renderList();
}

function saveTransactions(){
  
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  localStorage.setItem("transactions", JSON.stringify(transactions));
}