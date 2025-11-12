const inputVal = document.getElementById("search_field");
const tables = document.querySelectorAll("tbody tr");

inputVal.addEventListener('input', () => {
    const tables = document.querySelectorAll("tbody tr");
    tables.forEach((table)=>{
        const contentTable = table.textContent.toLowerCase();
        table.classList.toggle('hidden', !contentTable.includes(inputVal.value.toLowerCase()));
    })
})