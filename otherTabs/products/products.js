document.addEventListener("DOMContentLoaded", function() {
    showData()
    console.log(arr);
})
 
 var arr = new Array();

 //retreive data from local storage
function getData(){
    var str = localStorage.getItem('localProduct');
    if(str != null){
        arr = JSON.parse(str);
    }
}

/* queria só usar a mesma função e concatenar os resultados pra n precisar escrever td isso dnv, mas n lembro */
function validateEmpty(){
    getData();
    console.log(arr);
    var prodName = document.forms['formProduct']['prodName'].value;
    var prodAmount = document.forms['formProduct']['prodAmount'].value;
    var prodUnitPrice = document.forms['formProduct']['prodUnitPrice'].value;

    //see if there is nay empty space, could  just have used in the html, but i guess this is 'safer?'
    if((prodName == '' || null) || (prodAmount == '' || prodAmount == null) 
    || (prodUnitPrice == ''|| prodUnitPrice == null)){
        alert('Please fill in all fields');
        Exit();
    }

    //depois vejo isso
    const prodExists = arr.find(prodName => JSON.stringify(prodName.prodName.toUpperCase()) === document.forms['formProduct']['prodName'].value.toUpperCase())
    if(prodExists){
        alert('Product Already exists');
        Exit();
    }
}

function addData(){
    getData();
    validateEmpty();

    /*function htmlEncode(str){
    return String(str).replace(/[^\w. ]/gi, function(c){
        return '&#'+c.charCodeAt(0)+';';
    });
    prodname = document.getElementById('prodName').value
    prodNameEncode = htmlEncode(prodName)
    deveria poder fazer isso com todo o arr
    mds q caos t isso aqui
}*/ 
    
    arr.push({
        code: Math.floor(Math.random()*999) + 1,
        prodName: document.getElementById('prodName').value.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
        prodAmount: document.getElementById('prodAmount').value,
        prodUnitPrice: document.getElementById('prodUnitPrice').value,
        category: document.getElementById('category').value
    }); // podia tbm ter criado uma funcao pra validar e depois chamar ela tipo sla: function legal(arr){return /^[A-Za-z -]*$/.test(arr)} dai chama ela pra testar algum array 
    localStorage.setItem('localProduct', JSON.stringify(arr));
    //fvck regex, embrace alphanumeric whitelist
    onlyLetters();
    showData();
}

function showData(){
    getData()
    //var arr = JSON.parse(localStorage.getItem('localProduct'))

    var tbl = document.getElementById("tableCategory");
    //onlyLetters();
    var x = tbl.rows.length;
    while(--x){
         tbl.deleteRow(x);
     }

     for(i=0;i<arr.length;i++){

        var r = tbl.insertRow();
        var cell1 = r.insertCell();
        var cell2 = r.insertCell();
        var cell3 = r.insertCell();
        var cell4 = r.insertCell();
        var cell5 = r.insertCell();
        var cell6 = r.insertCell();

        cell1.innerHTML = arr[i].code;
        cell2.innerText = arr[i].prodName;
        cell3.innerHTML = arr[i].prodAmount  + " u";
        cell4.innerHTML = "$" + arr[i].prodUnitPrice;
        cell5.innerHTML = arr[i].category;

        var btn = document.createElement('input');
        btn.type = 'button';
        btn.className = 'btnDel';
         btn.value = 'Delete';
        btn.setAttribute('data-index', i);
        btn.addEventListener('click', function() {
            deleteRow(this.getAttribute('data-index'));
        });
        /* btn.onclick = deleteRow() */
        cell6.appendChild(btn);
        
    }
    
}

//só depois percebi q se eu colocar o match no push essa funcao e inutil, mas vo deixar o cadaver aqui 
//o match era mais facil só q sai n exclui efica a parada branca la no bd 
//validate it there is any invalid character and delete the row from the table, pega no ingreis
//pronto agr usei
//ignorar todos os comentarios amem obg  
function onlyLetters() {
    //var prodName = document.getElementById('prodName').value
    var prod = JSON.parse(localStorage.getItem('localProduct'));
    var validProd = [];

    for (var i = 0; i < prod.length; i++) {

        var prodName = prod[i].prodName;

        if (typeof prodName === 'string') {
            // check each character
            var isValid = true;
            for (var j = 0; j < prodName.length; j++) {
                var charCode = prodName.charCodeAt(j);
                // check alphanumeric or whitespace
                if (!((charCode >= 48 && charCode <= 57) || // 0-9
                      (charCode >= 65 && charCode <= 90) || // A-Z
                      (charCode >= 97 && charCode <= 122) || // a-z
                      charCode === 32)) { // space
                    isValid = false;
                    alert('sem pepe dessa vez plmds');
                    break; 
                }
            }
            // all ok, just push
            if (isValid) {
                validProd.push(prod[i]);
            }
        } else {
            // changed the string to antything else in html
            console.log('dont change my html, ' + i + ' is not a string.');
        }
    }
    // Update local storage with the modified array
    localStorage.setItem('localProduct', JSON.stringify(validProd));
}


function deleteRow(index){
    getData();
    arr.splice(index, 1);
    localStorage.setItem('localProduct', JSON.stringify(arr));
    showData();
}

document.addEventListener("DOMContentLoaded", function() {
    populateCategories();
});

function populateCategories() {
    var categories = getCategories();
    var selectElement = document.getElementById("category");

    selectElement.innerHTML = "";

    var defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Category";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectElement.appendChild(defaultOption);

    categories.forEach(function(category) {
        var option = document.createElement("option");
        option.value = category;
        option.text = category;
        selectElement.appendChild(option);
    });
}

function getCategories() {
    var categories = [];
    var data = localStorage.getItem("localData");
    if (data) {
        var arr = JSON.parse(data);
        arr.forEach(function(item) {
            if (!categories.includes(item.catName)) {
                categories.push(item.catName);
            }
        });
    }
    return categories;
}