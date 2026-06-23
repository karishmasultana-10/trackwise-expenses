let transinpt=document.getElementById("transinpt");
let transamnt=document.getElementById("transamt");
let transtype=document.getElementById("transtype");
let addbtn=document.getElementById("addtrns");
let translist=document.getElementById("trnslist");
let baldisplay=document.getElementById("balance-display");
let incdisplay=document.getElementById("income-display");
let expndisplay=document.getElementById("expenses-display");
let transdate=document.getElementById("transdate");
let totaltrans=document.getElementById("totaldisplay");
let transcat=document.getElementById("transcategory");
let piechart=document.getElementById("piechart");

let transaction=[];
let editId=null;
let retrieveddata=localStorage.getItem("expenseData");
if(retrieveddata){
    transaction=JSON.parse(retrieveddata);
    console.log(transaction)
    updateUI();
}
addbtn.onclick=function(event){
    let transVal=transinpt.value.trim();
    let amntVal=transamnt.value.trim();
    let mathamnt=Number(amntVal);
    let typeVal=transtype.value;
    let usrdate=transdate.value;
    let trans_cat=transcat.value;

    let capitalizedTrans=transVal.charAt(0).toUpperCase()+transVal.slice(1);

    if(transVal===''){
        alert("Enter the valid input");
        return;
    }
    if(amntVal===''){
        alert("Enter the valid amount");
        return;
    }
    if(usrdate===''){
        alert("Enter the valid date");
        return;
    }
    let slecteddate=new Date(usrdate);
    let todaydate=new Date();
    todaydate.setHours(0,0,0,0);

    if(slecteddate<todaydate){
        alert("Enter Valid Date");
        return;
    }

    for(let i=0;i<transaction.length;i++){
        if(transVal.toLowerCase()===transaction[i].name.toLowerCase()){
            alert("Stop adding duplicate transactions");
            transinpt.value="";
            transamnt.value="";
            transdate.value="";
            return;
        }
    }

    let transObj={name:capitalizedTrans, amount:mathamnt, category:trans_cat, type:typeVal, date:usrdate, id:Date.now()};
    if(editId===null){
        transaction.push(transObj);
        console.log(transaction);
    }
    else{
        for(let i=0;i<transaction.length;i++){
            if(transaction[i].id===editId){
                transaction[i].name=transVal;
                transaction[i].amount=mathamnt;
                transaction[i].category=trans_cat;
                transaction[i].type=typeVal;
                transaction[i].date=usrdate;
            }
        }
        editId=null;
        addbtn.textContent="Add";
    }
   

    transinpt.value='';
    transamnt.value='';
    transdate.value='';
    updateUI()
}

function updateUI(){
    let total_income=0;
    let total_expenses=0;
    
    renderTransactions(transaction);

    for(let i=0;i<transaction.length;i++){
        if(transaction[i].type==='Income'){
            total_income+=transaction[i].amount;
        }
        else{
            total_expenses+=transaction[i].amount;
        }
        
        
    }

    baldisplay.textContent=`₹${total_income-total_expenses} `;
    incdisplay.textContent=`₹${total_income}`;
    expndisplay.textContent=`₹${total_expenses}`;
    localStorage.setItem("expenseData", JSON.stringify(transaction));

    let totalamnt=Number(total_income + total_expenses);
    let incomeper=(total_income*100)/totalamnt;
    let expnsper=(total_expenses*100)/totalamnt;
    let incomeAngle=(incomeper*360)/100;
    let expnsAngle=(expnsper*360)/100;
   console.log(totalamnt,incomeper,expnsper,incomeAngle,expnsAngle);

   if(totalamnt>0){
    piechart.style.backgroundImage=`conic-gradient(
    green 0deg ${incomeAngle}deg,
    red  ${incomeAngle}deg 360deg)`
   }
   else{
    piechart.style.backgroundImage=`conic-gradient(
    green 0deg 180deg,red 180deg 360deg)`
   }
   
}

function renderTransactions(renderArray){
    totaltrans.textContent=`Total Transactions: ${renderArray.length}`;
    
    if(renderArray.length===0){
        translist.innerHTML="No Transactions Yet!";
        return;
    }

    translist.innerHTML='';
    for(let i=0;i<renderArray.length;i++){
        let mylist=document.createElement("li");

        let dltbtn=document.createElement("button");
        dltbtn.classList.add("dltbtn");
        dltbtn.textContent="Delete";

       let amountClass = renderArray[i].type === "Income" ? "income-amount" : "expense-amount";
        let typeClass = renderArray[i].type === "Income" ? "income-type" : "expense-type";

        mylist.innerHTML = `
            <span>${renderArray[i].name}</span>
            <span class="${amountClass}">
                ${renderArray[i].type === "Income" ? "+ ₹" : "- ₹"}${renderArray[i].amount}
            </span>
            <span>${renderArray[i].category}</span>
            <span>${renderArray[i].date}</span>
            <span class="${typeClass}">${renderArray[i].type}</span>
        `;

        translist.appendChild(mylist);
        mylist.appendChild(dltbtn);

        let idTodelete=renderArray[i].id;
        
       
        dltbtn.onclick=function(){
            let confirmdlt=confirm("Are you sure you want to delete the transaction?");
            if(confirmdlt){
               transaction=transaction.filter((item)=>{
                return item.id!=idTodelete;
            });
            updateUI(); 
            }
            
            
        }

        let edtbtn=document.createElement("button");
        edtbtn.classList.add("edtbtn");
        edtbtn.textContent="Edit";
        mylist.appendChild(edtbtn);

        edtbtn.onclick=function(event){
            
            transinpt.value=renderArray[i].name;
            transamnt.value=renderArray[i].amount;
            transcat.value=renderArray[i].category;
            transtype.value=renderArray[i].type;
            transdate.value=renderArray[i].date;
            
            addbtn.textContent="Update";
            editId=renderArray[i].id;

        }
    }
    
}

let clrallbtn=document.getElementById("clearall");
clrallbtn.onclick=function(event){
    transaction=[];
    translist.innerHTML="NO TASKS YET!";
    localStorage.removeItem("expenseData");
    updateUI();
};

let searchtrans=document.getElementById("searchtrans");
searchtrans.addEventListener("input",function(event){
    let transname=searchtrans.value;
    let lwrcstrns=transname.toLowerCase();
    let fltrarr=[];

    for(let i=0;i<transaction.length;i++){
        let lwrcsarr=transaction[i].name.toLowerCase();
        if(lwrcsarr.includes(lwrcstrns)){
            fltrarr.push(transaction[i]);
            
        }
        
    }
    renderTransactions(fltrarr);
});

function setActiveFilter(activeButton) {
    all_trans.classList.remove("active");
    income_trans.classList.remove("active");
    expense_trans.classList.remove("active");

    activeButton.classList.add("active");
}

let all_trans = document.getElementById("all");
all_trans.onclick = function(event) {
    renderTransactions(transaction);
    setActiveFilter(all_trans);
};

let income_trans = document.getElementById("income");
income_trans.onclick = function(event) {
    let incomeArray = transaction.filter((item) => {
        return item.type === "Income";
    });

    renderTransactions(incomeArray);
    setActiveFilter(income_trans);
};

let expense_trans = document.getElementById("expenses");
expense_trans.onclick = function(event) {
    let expenseArray = transaction.filter((item) => {
        return item.type === "Expenses";
    });

    renderTransactions(expenseArray);
    setActiveFilter(expense_trans);
};
setActiveFilter(all_trans);


