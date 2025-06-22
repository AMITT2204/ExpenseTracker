let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let totalExpenses = 0;
let totalIncome = 0;
let balance = 0;

const expenseForm = document.getElementById('expense-form');
const expensesTable = document.getElementById('expenses-table');
const expensesTbody = document.getElementById('expenses-tbody');
const saveExpenseChanges = document.getElementById('save-expense-changes');

let editingIndex = null;

expenseForm.addEventListener('submit', addExpense);
expensesTable.addEventListener('click', handleExpenseAction);
saveExpenseChanges.addEventListener('click', saveExpenseChangesFunc);

function addExpense(e) {
    e.preventDefault();
    const expense = {
        name: document.getElementById('expense-name').value,
        amount: parseFloat(document.getElementById('expense-amount').value),
        date: document.getElementById('expense-date').value,
    };
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    updateDashboard();
    renderExpenses();
    expenseForm.reset();
}

function updateDashboard() {
    totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    document.getElementById('total-expenses').textContent = totalExpenses;
    document.getElementById('total-income').textContent = totalIncome;
    document.getElementById('balance').textContent = totalIncome - totalExpenses;
}

function renderExpenses() {
    expensesTbody.innerHTML = '';
    expenses.forEach((expense, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.name}</td>
            <td>$${expense.amount}</td>
            <td>${expense.date}</td>
            <td>
                <button class="btn btn-primary edit-btn" data-index="${index}">Edit</button>
                <button class="btn btn-danger delete-btn" data-index="${index}">Delete</button>
            </td>`;
        expensesTbody.appendChild(row);
    });
}

function handleExpenseAction(e) {
    const index = parseInt(e.target.getAttribute('data-index'));
    if (e.target.classList.contains('edit-btn')) {
        editingIndex = index;
        const expense = expenses[index];
        document.getElementById('edit-expense-name').value = expense.name;
        document.getElementById('edit-expense-amount').value = expense.amount;
        document.getElementById('edit-expense-date').value = expense.date;
        const modal = new bootstrap.Modal(document.getElementById('edit-expense-modal'));
        modal.show();
    } else if (e.target.classList.contains('delete-btn')) {
        expenses.splice(index, 1);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        updateDashboard();
        renderExpenses();
    }
}

function saveExpenseChangesFunc() {
    expenses[editingIndex] = {
        name: document.getElementById('edit-expense-name').value,
        amount: parseFloat(document.getElementById('edit-expense-amount').value),
        date: document.getElementById('edit-expense-date').value,
    };
    localStorage.setItem('expenses', JSON.stringify(expenses));
    updateDashboard();
    renderExpenses();
    bootstrap.Modal.getInstance(document.getElementById('edit-expense-modal')).hide();
}

renderExpenses();
updateDashboard();
