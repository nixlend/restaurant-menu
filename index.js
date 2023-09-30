import { menuArray } from '/data.js'

const menuSection = document.getElementById("menu-items")
const orderReviewSection = document.getElementById("order-review")
const cardDetailsSection = document.getElementById("card-details")
const thankYouSection = document.getElementById("thank-you")
const orderReviewStatus = []
const creditCard = [{name: ""}, {cardNumber: ""}, {cvv: 0}]

document.addEventListener('click', e => {
    if(e.target.dataset.addOrder){
        handleAddOrderClick(e.target.dataset.addOrder)
    } else if (e.target.dataset.remove){
        console.log("user clicked on removed")
        handleRemoveClick(e.target.dataset.remove)
    } else if (e.target.id === "complete-order") {
        handleCompleteOrderClick()
    }
})

document.addEventListener('submit', e => {
    if(e.target.id === "card-info-form") {
        e.preventDefault()
        handlePayClick()
    }
})

function initRender() {
    menuArray.forEach(function(foodItem) {
        menuSection.innerHTML += `
        <div class="food-item">
            <p>${foodItem.emoji}</p>
            <div class="name-ingredients-price">
                <h2>${foodItem.name}</h2>
                <p class="ingredients" id="ingredients">${foodItem.ingredients.join(', ')}</p>
                <p class="price" id="price">&#36;${foodItem.price}</p>
            </div>
            <div class="add-order" data-add-order="${foodItem.id}">
                <i class="fa-solid fa-plus" data-add-order="${foodItem.id}"></i>
            </div>
        </div>
        <hr />
        `
    })
}

function handleAddOrderClick(id) {
    //add the id and value to orderReviewStatus if it doesnt exist, if it exist, then update the value to +1
    if(orderReviewStatus.filter( order => order.id == id).length === 0) {
        orderReviewStatus.push({"id": id, "value": 1})
        thankYouSection.textContent = ``
        console.log("nothing in array equal to" + id + ", creating new one in array")
    } else {
        orderReviewStatus.forEach(function(order){
            if(order.id == id){
                order.value++
            }
        })
    }  
    console.log(orderReviewStatus)
    render("orderReview")
}

function handleRemoveClick(id) {
    orderReviewStatus.forEach( (order, index) => {
        if(order.id == id && order.value === 1) {
            orderReviewStatus.splice(index, 1)
        } else if (order.id == id) {
            order.value--
        }
    })
    render("orderReview")
}

function handleCompleteOrderClick() {
    render("cardDetail")
}

function handlePayClick() {
    // Get information from card detail page
    creditCard.name = document.getElementById("customerName").value
    creditCard.cardNumber = document.getElementById("cardNumber").value
    creditCard.cvv = document.getElementById("cvv").value
    console.log(creditCard.name + " " + creditCard.cardNumber + " " + creditCard.cvv)
    render("pay")
    creditCard.name = ""
    creditCard.cardNumber = ""
    creditCard.cvv = 0
    console.log(creditCard)
}

function getOrderReviewHtml() {
    // Pontential to refactor the two if statement
    if (orderReviewStatus.length > 0) {
        let allAddedOrderHtml = []
        let totalPrice = 0
        orderReviewStatus.forEach(function(addedItem){
            const menuItem = menuArray.filter( food => food.id == addedItem.id)[0]
            allAddedOrderHtml.push(`
            <div class="cart-item">
                <h2>${menuItem.name} ${addedItem.value > 1 ? " x " + addedItem.value : ""}</h2>
                <p class="remove" id="remove" data-remove="${menuItem.id}">remove</p>
                <p class="cart-item-price" id="cart-item-price">$${menuItem.price}</p>
            </div>`)
            totalPrice += menuItem.price * addedItem.value
        })
        orderReviewSection.innerHTML = `
        <h2>Your order</h2>
            ${allAddedOrderHtml.join('')}
            <hr />
            <div class="total-price-sec">
                <h2>Total price:</h2>
                <p id="total">$${totalPrice}</p>
            </div>
        <a class="complete-order btn" href="#" id="complete-order">Complete order</a>
        `
    } else if (orderReviewStatus.length === 0) {
        orderReviewSection.innerHTML = ``
    }
}

function getCardDetailHtml() {
    cardDetailsSection.style.display = "block";
    cardDetailsSection.innerHTML = 
    `
    <form class="card-container" id="card-info-form">
        <h2>Enter card details</h2>
        <label for="name"></label>
        <input type="text" id="customerName" name="name" placeholder="Enter your name">
        <label for="cardNumber"></label>
        <input type="text" id="cardNumber" name="cardNumber" placeholder="Enter card number">
        <label for="cvv"></label>
        <input type="number" id="cvv" name="cvv" placeholder="Enter CVV">
        <button class="pay btn" href="#" id="pay">Pay</button>
    </form>
    `
}

function getPaymentHtml() {
    orderReviewSection.innerHTML = ``
    // One way to empty the array!
    orderReviewStatus.length = 0 
    cardDetailsSection.innerHTML = ``
    cardDetailsSection.style.display = "none";
    // thank you
    thankYouSection.innerHTML = `<h2>Thanks, ${creditCard.name}! Your order is on its way!</h2>`
}

const render = html => {
    if(html === "orderReview") {
        return getOrderReviewHtml()
    } else if (html === "cardDetail") {
        return getCardDetailHtml()
    } else if (html === "pay") {
        return getPaymentHtml()
    } else if (html === "removeOrder") {
        return getRemoveHtml()
    }

}

initRender()