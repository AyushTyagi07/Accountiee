const electron = require("electron");
    const ipc = electron.ipcRenderer;
    
    var date;
        
        console.log("Asking date");
        ipc.send("getmydate")
        ipc.on("sentdate", function(event,result){
          console.log(result);
          date = String(result);
        })


        


   var total=0;
   var count=0;
   var pid =0;
   var total=0;
   var check = 0;
   var gtax = 0;
   
   var path = require("path")
   var knex = require("knex")({
 client: "sqlite3",
 connection: {
   filename: path.join(__dirname, 'engine/datast.sqlite3')
     }
   });
   console.log("DB logged");

document.getElementById("AddEntry").addEventListener("click", function(){
  var price = document.getElementById("Price").value;
  var weight = document.getElementById("Weight").value;
   var amount = price*weight;
   var pname = document.getElementById("Pname").value;
   var tax = gtax;

   
   var atax = amount*(tax/100);
   document.getElementById("TAX").innerHTML=atax;
   amount = amount+atax;
   var updatedbal = gbalance+amount;
   var upsale = gsale+amount;
   console.log("PID:"+ pid)
   console.log("started");
   knex("Transaction").insert([{
     PID: pid,
     Date: date,
     Amount: amount,
     Product: pname,
     Tax: atax,
     Price: price,
     Weight: weight,
     Balance:updatedbal
    }]).then(function() {
              console.log('Inserted Entry');
              alertify.notify('Entry Added', 'success',5);
              var price = document.getElementById("Price").value="";
              document.getElementById("username").value="";
              document.getElementById("Weight").value="";
              document.getElementById("Pname").value="";
              document.getElementById("TAX").innerHTML="";
              document.getElementById("Total").innerHTML="";
            })
            .catch(function(error) { console.error(error); });

            knex("Person").where("PID",pid)
            .update({
              "Balance":updatedbal,
              "Sale":upsale
            }).then(function() {
                       console.log('Updating Entry');
                     })
                     .catch(function(error) { console.error(error); });
            
            
});




function autocomplete(inp, arr, pids) {
    console.log("Autocomplete Started");
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
          console.log("adding")
          console.log(arr[i])
          console.log(val);
          console.log(arr[i].substr(0, val.length).toUpperCase());
          console.log(val.toUpperCase())
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          b = document.createElement("DIV");
          console.log("created Div")
          b.setAttribute("id", pids[i]);
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              pid = this.id;
              console.log(pid);
              knex("Person").where("PID",pid)
              .then(function(rows) {
                console.log(rows);
                gtax = rows[0].Tax;
                gbalance = rows[0].Balance;
                gsale = rows[0].Sale;
                console.log('global tax :' + gtax);
                console.log('global BALANCE :' + gbalance);
                document.getElementById("TAX").innerHTML = gtax + "%";
              })
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
console.log("Autocomplete ended");
}