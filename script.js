'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'twi-GH',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
const formatMovementDate = function (date, locale) {
//   const now = new Date();
// const option = {
//   hour: 'numeric',
//   minuet: 'numeric',
//   day: 'numeric',
//   month: 'long',//(numeric or 2-digit)
//   year: 'numeric',//(2-digit)
//   weekday: 'long'
//}
//other obtion getting it from local
// const local = navigator.language;
// console.log(local)




   const calcDaysPassed = (date1, date2) =>
     Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

   const daysPassed = calcDaysPassed(new Date(), date);
   if (daysPassed === 0) return 'Today';
   if (daysPassed === 1) return 'Yesterday';
   if (daysPassed <= 7) return `${daysPassed} days ago`;

  //  const day = `${date.getDate()}`.padStart(2, '0');
  //  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  //  const year = date.getFullYear();
   return new Intl.DateTimeFormat(locale).format(date);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogoutTimer = function() {
 const tick = function(){
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2,0);

    //in each call, print the remaining time to UI

    labelTimer.textContent = `${min}:${sec}`;

    
    //when 0 seconds, stop timer and log out user
    if (time === 0){
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started'
      containerApp.style.opacity = 0;
    }

    //Decrease 1s
    time--;
  };
 
  //ste time to 5 minuet
  let time = 30;
  //call the timer every seconds
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

//Fake Always Logged In
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

//Experimenting API
// const now = new Date();
// const option = {
//   hour: 'numeric',
//   minuet: 'numeric',
//   day: 'numeric',
//   month: 'long',//(numeric or 2-digit)
//   year: 'numeric',//(2-digit)
//   weekday: 'long'
// }
// //other obtion getting it from local
// const local = navigator.language;
// console.log(local)
// labelDate.textContent = new Intl.DateTimeFormat(local, option).format(now)// labelDate.textContent = new intl.DateTimeFormat('twi-GH', option)



//labelDate.textContent = `${day}/${month}/${year}, ${hours}:${min}`;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    const now = new Date();
     const option = {
       hour: 'numeric',
       minuet: 'numeric',
       day: 'numeric',
       month: 'long',//(numeric or 2-digit)
       year: 'numeric',//(2-digit)
      //  weekday: 'long'
    };

   labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, option).format(now);

    //creating a welcome date
    // const now = new Date();
    // const day = `${now.getDay()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hours = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hours}:${min}`;


    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //Timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmountvalue);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Adding TransferDate
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    //reset the timer 
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function(){// Add movement
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());

    //Add loan date


    // Update UI
    updateUI(currentAccount);
  }, 3000)
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*
console.log(23 === 23.0)
//base 10 - 0 to 9
//binary base 2 - 0 1
console.log(+"23")
console.log(Number.parseInt("73", 10))

console.log(Number.parseFloat(" 73.6rem", 10))


console.log(Number.isNaN("73"))
console.log(Number.isNaN(73))
console.log(Number.isNaN(+'73'))

//the best way to check if a value is a real number
console.log(Number.isFinite(20))
console.log(Number.isFinite("20"))

//Maths and rounding
console.log(Math.sqrt(25))
console.log(25 ** (1/2))
console.log(8 ** (1/3))

console.log(Math.max(5,6,78,9,89,23,5))
console.log(Math.min(5,6,78,9,89,23,5))

console.log(Math.PI * Number.parseFloat('10px') ** 2);

console.log(Math.floor(Math.random() * 6) + 1);

const randomInt = (min, max) => Math.trunc(Math.random() * (max - min) + 1) + min;
console.log(randomInt(10, 20));

//rounding integers
console.log(Math.round(23.56))
console.log(Math.round(99.9))

console.log(Math.trunc(89.09))
console.log(Math.trunc(56.888))


console.log(Math.ceil(56.888))
console.log(Math.ceil(5.888))

console.log(Math.floor(56.888))
console.log(Math.floor(-56.888))

//rounding decimal
console.log(+(2.5).toFixed(0))
console.log(+(2.5).toFixed(2))
console.log(+(2.56456).toFixed(3))
console.log((2.5).toFixed(1))

//Reminder
console.log(5 % 2);
console.log(8 % 3);

const isEven = n => n % 2 === 0;
console.log(isEven(32));
console.log(isEven(20));
console.log(isEven(60));
console.log(isEven(91));

// labelBalance.addEventListener('click', function(){
//   [...document.querySelectorAll('.movements_row')].forEach(function(row, i){
//     if(i % 2 === 0) row.style.backgroundColor = 'orangered';
//   })
// })

labelBalance.addEventListener('click', function() {
  [...document.querySelectorAll('.movements_row')].forEach(function(row, i) {
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';

    if (i % 3 === 0) row.style.backgroundColor = "blue";
  });
});
//seperator
const diameter = 287_460_000_000;
console.log(diameter)

//Bigint
console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(37436848675347845698567408956075865873850n);
//or
console.log(BigInt(2532635));

//Operations
console.log(1000000n + 189898n)
console.log(2345n *234456n)

//Exception
console.log(24n > 16);
console.log(24n === 20);
console.log(typeof 24n);
console.log(20n == "20");

//Division
console.log(24n / 16n);
console.log(24 / 16);

console.log(10n / 3n);

//creating a date 
const now = new Date();
console.log(now);
console.log(new Date('Wed May 22 2024 03:39:15'));
console.log(new Date('December 24, 2024'))
console.log(new Date(account1.movementsDates[0]))

console.log(new Date(2037, 10, 19, 15, 23, 5));
console.log(new Date (2037, 10, 31));

console.log(new Date(0))
console.log(new Date(3 * 24 * 60 * 1000));


//working with Dates
const future = new Date(2037, 10, 19, 15, 23); 
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString());

//Time stamp
console.log(new Date(2142256980000));

console.log(Date.now())

//date 
future.setFullYear(2024);
console.log(future)


// operation with Date.
const future = new Date(2037, 10, 19, 15, 23); 
console.log(+future);

const calcDatepass = (date1, date2) => Math.abs(date2 - date1) / (1000 * 60 * 60 *24);
const day1 = calcDatepass(new Date(2037, 10, 19), new Date(2037, 10, 30));
console.log(day1) 

//setTimeout
const ingredient = ['Olive', 'Spinach']
const pizzaTimer = setTimeout((ing1,ing2)=> console.log(`Here is your pizza wit ${ing1} and ${ing2}`), 3000,
...ingredient
);
//delays time for displaying
console.log('loading....')

if (ingredient.includes('spinach')) clearTimeout(pizzaTimer)

//setInterval
setInterval(function(){
  const now = new Date();
  console.log(now);
},2000);// this excute every 2seconds
*/






























