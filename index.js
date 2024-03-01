/* mesmo codigo em 3 arquivos, estou a coringar */
/* var arr = new Array() */
//var arr = JSON.parse(localStorage.getItem("localProduct"))

document.addEventListener("DOMContentLoaded", function() {
    showData();
    populateProducts();
    document.getElementById('product').addEventListener('change', fillValue);
    console.log(arr);
    //deleteRow0()
    //document.getElementById('btnFinish').addEventListener('click', showDataHistory)
});

var arr = new Array();

function getData(){
    var str = localStorage.getItem('localCart');
    if(str != null){
        arr = JSON.parse(str);
        console.log(str);
        console.log(arr);
    }
}

function addData(){
    getData();
    checkZero();
    checkDuplicate();
   
    var totalRow = 0;
    var prodAmount = document.forms['shopForm']['amount'].value;
    var prodUinitPrice = document.forms['shopForm']['unitPrice'].value;
    var totalRow = prodAmount * prodUinitPrice;

    arr.push({
        //codePurchase: Math.floor(Math.random()*999) + 1,
        total: totalRow,
        prodName: document.getElementById('product').value,
        prodAmount: document.getElementById('amount').value,
        prodUnitPrice: document.getElementById('unitPrice').value,
        tax: document.forms['shopForm']['tax'].value,
        date: new Date().toLocaleDateString()
    });
    localStorage.setItem('localCart', JSON.stringify(arr));
    showData();
    deleteRow0();
}

function checkDuplicate(){
    var prod = document.getElementById('product').value;
    var arr = JSON.parse(localStorage.getItem('localCart')) || [];

    for(i=0;i<arr.length;i++){
        if(prod == arr[i].prodName){
            console.log(prod);
            console.log(arr[i].prodName);
            alert('Product alredy in the cart');
            Exit();
        }
    }
}

function showData(){
    getData();

    var tbl = document.getElementById("productTable");

    var x = tbl.rows.length;
    while(--x){
        tbl.deleteRow(x);
    }

    var totalSum = 0;
    var totalTax = 0;
    console.log(arr);

    for(i=0;i<arr.length;i++){
        var r = tbl.insertRow();
        var cell1 = r.insertCell();
        var cell2 = r.insertCell();
        var cell3 = r.insertCell();
        var cell4 = r.insertCell();
        var cell5 = r.insertCell();

        var total = arr[i].prodUnitPrice * arr[i].prodAmount;
        var taxPercentage = parseFloat(arr[i].tax);
        var tax = total * (taxPercentage/100);
        totalSum += total;
        totalTax += tax;

        cell1.innerHTML = arr[i].prodName;
        cell2.innerHTML = "$" + arr[i].prodUnitPrice;
        cell3.innerHTML = arr[i].prodAmount;
        cell4.innerHTML = "$" + total;

        var btn = document.createElement('button');
        btn.className = 'btnDel';
        btn.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
        //btn.value = 'Delete'
        btn.setAttribute('data-index', i);
        btn.addEventListener('click', function() {
            deleteRow(this.getAttribute('data-index'));
        });
        /* btn.onclick = deleteRow() */
        cell5.appendChild(btn);
    }
    var totalPrice = totalSum + totalTax;
    document.getElementById('totalTxt').innerText = "Total: $" + totalPrice.toFixed(0);
    document.getElementById('taxTxt').innerText = "Tax: $" + totalTax.toFixed(0);
}

function deleteRow(index){
    getData();
    arr.splice(index, 1);
    localStorage.setItem('localCart', JSON.stringify(arr));
    showData();
}

//por enquanto fica na gambiarra isso aqui, depois tento arrumar o bug
function deleteRow0(){
    getData();
    if(arr[0].code){
        arr.splice(0,arr.length - 1);
        localStorage.setItem('localCart', JSON.stringify(arr));
        showData();
    }
}

function populateProducts() {
    var products = getProducts();
    var selectElement = document.getElementById("product");

    selectElement.innerHTML = "";

    var defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Product";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectElement.appendChild(defaultOption);

    products.forEach(function(product) {
        var option = document.createElement("option");
        option.value = product;
        option.text = product;
        selectElement.appendChild(option);
    })
}

function getProducts() {
    var products = [];
    var arrProd = JSON.parse(localStorage.getItem("localProduct"));
    if (arrProd) {
        arrProd.forEach(function(item) {
            if (!products.includes(item.prodName)) {
                products.push(item.prodName);
            }
        });
    }
    return products;
}

function findTax(catName){
    var categoryData = JSON.parse(localStorage.getItem("localData"));
    console.log(categoryData);
    
    var categoryTax = categoryData.find(item => item.catName === catName);

    if(categoryTax){
        return categoryTax.tax;
    }
}

function fillValue(){
    var opt = document.getElementById('product').value;
    arr = JSON.parse(localStorage.getItem('localProduct'));
    var productData = arr.find(product => product.prodName == opt);

    if(productData){
        document.getElementById('unitPrice').value = productData.prodUnitPrice;

        var productCategory = productData.category;
        
        var tax = findTax(productCategory);
        document.getElementById('tax').value = tax;
    }
}

//n sei pq usei função de flecha
const checkZero = () => {
    var prodAmount = document.forms['shopForm']['amount'].value;
    if(prodAmount == 0){
        alert('Please enter an amount greater than 0');
        Exit();
    }
}



//HISTORICO, PQ N CRIEIUM NOVO ARQUIVO? BOA PERGUNTA



var city = ' ';

getCoordinates();

function addDataHistory(){
    getDataHistory();
   
    var arr = JSON.parse(localStorage.getItem('localCart'));
    var newArr = JSON.parse(localStorage.getItem('localHistory'));
    var tbl = document.getElementById("productTable");
    var x = tbl.rows.length;
    var purchaseCode = generatePurchaseCode();

    if (!Array.isArray(newArr)) {
        newArr = [];
    }

    while(--x){
        tbl.deleteRow(x);
    }

    var totalSum = 0;
    var totalTax = 0;
    var totalPay = 0;

    for(var i = 0; i < arr.length; i++){
        var x = parseInt(arr[i].prodUnitPrice, 10);
        var y = parseInt(arr[i].prodAmount, 10);
        var z = parseInt(arr[i].tax, 10);

        var total = x * y;
        var taxPercentage = z;
        var tax = total * (taxPercentage/100);
        totalSum += total;
        totalTax += tax;
        totalPay = totalSum + totalTax;
    }

    newArr.push({
        codePurchase: purchaseCode,
        totalPurchase: totalPay.toFixed(0),
        tax: totalTax.toFixed(0),
        date: new Date().toLocaleDateString(),
        cidade: city,
        cart: arr,
    })
    if(validatePurchase() == true){localStorage.setItem('localHistory', JSON.stringify(newArr));}
}

function validatePurchase() {
    var cart = JSON.parse(localStorage.getItem('localCart')) || [];
    cart[i].id = bolas
    var products = JSON.parse(localStorage.getItem('localProduct')) || [];

    console.log('Cart Items:', cart);
    console.log('Local Products:', products);

    if (!Array.isArray(cart) || !Array.isArray(products)) {
        alert("Cart items or products are not valid arrays.");
        return;
    }

    for (var i = 0; i < cart.length; i++) {
        var cartItem = cart[i];

        console.log('Processing cart item:', cartItem.prodName);

        var cartProductName = cartItem.prodName.trim();
        var product = products.find(p => p.prodName === cartProductName);

        if (product) {
            // Convert prodAmount to number
            var availableQuantity = parseInt(product.prodAmount, 10);
            var requestedQuantity = parseInt(cartItem.prodAmount, 10);

            if (requestedQuantity > availableQuantity) {
                alert('Insufficient stock for product:', cartProductName);
                return false;
                //Exit()
            }else{
                product.prodAmount -= requestedQuantity;
            }
        } else {
            alert("Product not found in localProducts:", cartProductName);
        }
    }
    localStorage.setItem('localProduct', JSON.stringify(products));
    console.log('updated localProduct ', products);
    return true
}

function getDataHistory(){
    var str = localStorage.getItem('localHistory');
    if(str != null){
        newArr = JSON.parse(str);
    }
}

//tenho q colocar isso no resto, mas se eu for usar bd depois nem vo me incomodar
function generatePurchaseCode() {
    var purchaseCodeCounter = parseInt(localStorage.getItem('purchaseCodeCounter')) || 0;

    purchaseCodeCounter++;

    localStorage.setItem('purchaseCodeCounter', purchaseCodeCounter);

    return purchaseCodeCounter;
}

//pq? sla só achei q seria legal ter :)
function getCoordinates() {
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(pos) {
        var crd = pos.coords;
        var lat = crd.latitude.toString();
        var lng = crd.longitude.toString();
        var coordinates = [lat, lng];
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        getCity(coordinates);
    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
}

function getCity(coordinates) {
    var xhr = new XMLHttpRequest();
    var lat = coordinates[0];
    var lng = coordinates[1];
 
    xhr.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=pk.0d6a4ee59d60e0c5a5f09ccb9024a5a1&lat=" +
        lat + "&lon=" + lng + "&format=json", true);
    xhr.send();
    xhr.onreadystatechange = processRequest;

    function processRequest() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            city = response.address.city;
            console.log(city)
        }
    }
}