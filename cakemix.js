
function noResults() {
 document.getElementById('mtrl').innerHTML = 'x';
 document.getElementById('master').innerHTML = 'x';
 document.getElementById('pcat').innerHTML = 'x';
 document.getElementById('pkg_date_code_id').innerHTML = 'x';
 



}

function gotAMatch(obj) {
 document.getElementById('mtrl').classList.add('hit')
 document.getElementById('master').classList.add('hit');
 document.getElementById('pcat').classList.add('hit');
 
 document.getElementById('pkg_date_code_id').innerHTML = obj.pkg_date_code_id;
 document.getElementById('pkg_date_code_model').innerHTML = obj.pkg_date_code_model;
 document.getElementById('cs_date_code_id').innerHTML = obj.cs_date_code_id;
 document.getElementById('cs_date_code_model').innerHTML = obj.cs_date_code_model;

 document.getElementById('z1_max_22').innerHTML = obj.z1_max_22;
 document.getElementById('en_max_40').innerHTML = obj.en_max_40;
 document.getElementById('en_len').innerHTML = obj.en_len;
 
}

function notAMatch() {
 document.getElementById('mtrl').classList.remove('hit')
 document.getElementById('master').classList.remove('hit');
 document.getElementById('pcat').classList.remove('hit');
 
 document.getElementById('pkg_date_code_id').innerHTML = 'x';
 document.getElementById('pkg_date_code_model').innerHTML = 'x';
 document.getElementById('cs_date_code_id').innerHTML = 'x';
 document.getElementById('cs_date_code_model').innerHTML = 'x';
 document.getElementById('z1_max_22').innerHTML = 'x';
 document.getElementById('en_max_40').innerHTML = 'x';
 document.getElementById('en_len').innerHTML = 'x';
}

function queryResultsArr(arr) {
 let x = [];
 let n = (arguments.length-1)/2; // number of conditions that need to be met
 for (let i = 0; i < arr.length; i++) {
  let count = 0;  // hits in the row
  for (let j = 1; j < arguments.length; j += 2) {
    // key = arguments[j+0]
    // val = arguments[j+1]
    if (arguments[j+1] === arr[i][arguments[j]]) {
     count++;
     if (count === n) {
      x.push(arr[i]);
     } 
    }
  }
 }
 return x;
}

window.onload = function() {

 let arr = fetch('cakemix.json?x=' + Math.random()).then(r => r.json()).then(arr => {

 let n_placeHolderSearch = 3;

  arr.sort(function(a,b) {
   return a.master - b.master;
  }).sort(function(a,b) {
   return a.cat4c - b.cat4c;
  });
  console.log(arr);

  let mtrlEl = document.getElementById('mtrl');
  let masterEl = document.getElementById('master');
  let pcatEl = document.getElementById('pcat');
  
  
  // TEST INITIAL MTRL VALUE
  let results = queryResultsArr(arr, 'mtrl_no', mtrlEl.value);
  if (results.length > 0) {
   gotAMatch(results[0]);
   document.getElementById('master').value = results[0].master;
   document.getElementById('pcat').value = results[0].pcat_id;
  } else {
   masterEl.value = '';
   pcatEl.value = '';
   masterEl.placeholder = 'master';
   pcatEl.placeholder = 'pcat';
  }
  
  // MTRL VALUE EVENT LISTENER
  mtrlEl.addEventListener('input', function() {
   let results = queryResultsArr(arr, 'mtrl_no', this.value);
   if (results.length > 0) {
    gotAMatch(results[0]);
    masterEl.value = results[0].master;
    pcatEl.value = results[0].pcat_id;
   } else {
    notAMatch();
    masterEl.value = '';
    pcatEl.value = '';
    masterEl.placeholder = 'master';
    pcatEl.placeholder = 'pcat';
   }
  });
  
  // PCAT VALUE EVENT LISTENER
  pcatEl.addEventListener('input', function() {
   let master = masterEl.value;
   let pcat = pcatEl.value.toUpperCase();
   let results = queryResultsArr(arr, 'pcat_id', pcat, 'master', master);
   if (results.length > 0) {
    gotAMatch(results[0]);
    mtrlEl.value = results[0].mtrl_no;
   } else {
    notAMatch();
    mtrlEl.value = '';
   }
   
   if (queryResultsArr(arr, 'pcat_id', pcat).length > 0) {
     document.getElementById('pcat').classList.add('hit');
   }
   if (queryResultsArr(arr, 'master', master).length > 0) {
     document.getElementById('master').classList.add('hit');
   }   
   
   // THE CASE WHERE WE DELETE masterEl.value but pcatEl.value is legit
   if (master === '') {
    let results = queryResultsArr(arr, 'pcat_id', pcat, 'mtrl_active', '1');
    if (results.length > 0) {
     let m = n_placeHolderSearch;
     masterEl.placeholder = '';
     for (let k = 0; k < results.length; k++) {
     
      if (k < m) {
       masterEl.placeholder += results[k].master;
       
       if (k != (m-1)) {
        masterEl.placeholder += ', ';
       } else {
        masterEl.placeholder += '...(' + results.length + ')';
       }
      } 
     }
    } else {
      // no results
      masterEl.placeholder = 'master';
    }
   }
   
   // THE CASE WHERE I DELETE pcatEl.value and masterEl.value is legit (and visa versa)
   if (pcat === '') {
    let results = queryResultsArr(arr, 'master', master, 'mtrl_active', '1');
    if (results.length > 0) {

     //console.log(results);
     results.sort(function(a,b) {
       let x = a.pcat_id;
       let y = b.pcat_id;
       if (x < y) {
         return -1;
       }
       if (x > y) {
         return 1;
       }
       return 0;
     });
     console.log(results);
     
     let m = n_placeHolderSearch;
     pcatEl.placeholder = '';
     for (let k = 0; k < results.length; k++) {
     
      if (k < m) {
       pcatEl.placeholder += results[k].pcat_id;
       
       if (k != (m-1)) {
        pcatEl.placeholder += ', ';
       } else {
        pcatEl.placeholder += '...(' + results.length + ')';
       }
      } 
     }
    } else {
      // no results
      pcatEl.placeholder = 'pcat';
    }
   }
   
   
  });
  
  // MASTER VALUE EVENT LISTENER
  masterEl.addEventListener('input', function() {
   let master = masterEl.value;
   let pcat = pcatEl.value.toUpperCase();
   let mtrl = mtrlEl.value;
   let results = queryResultsArr(arr, 'pcat_id', pcat, 'master', master);
   
   // BOTH HITS
   if (results.length > 0) {
    gotAMatch(results[0]);
    mtrlEl.value = results[0].mtrl_no;
   } else {
    notAMatch();
    mtrlEl.value = '';
   }
   
   if (queryResultsArr(arr, 'pcat_id', pcat).length > 0) {
     document.getElementById('pcat').classList.add('hit');
   }
   if (queryResultsArr(arr, 'master', master).length > 0) {
     document.getElementById('master').classList.add('hit');
   }
 
   
   
   // ONE HIT; ONE BLANK
   // THE CASE WHERE I DELETE pcatEl.value and masterEl.value is legit (and visa versa)
   if (pcat === '') {
    let results = queryResultsArr(arr, 'master', master, 'mtrl_active', '1');
    if (results.length > 0) {
     let m = n_placeHolderSearch;
     pcatEl.placeholder = '';
     for (let k = 0; k < results.length; k++) {
     
      if (k < m) {
       pcatEl.placeholder += results[k].pcat_id;
       
       if (k != (m-1)) {
        pcatEl.placeholder += ', ';
       } else {
        pcatEl.placeholder += '...(' + results.length + ')';
       }
      } 
     }
    } else {
      // no results
      pcatEl.placeholder = 'pcat';
    }
   }
   
   // ONE HIT; ONE BLANK
   // THE CASE WHERE WE DELETE masterEl.value but pcatEl.value is legit
   if (master === '') {
    let results = queryResultsArr(arr, 'pcat_id', pcat, 'mtrl_active', '1');
    if (results.length > 0) {
     let m = n_placeHolderSearch;
     masterEl.placeholder = '';
     for (let k = 0; k < results.length; k++) {
     
      if (k < m) {
       masterEl.placeholder += results[k].master;
       
       if (k != (m-1)) {
        masterEl.placeholder += ', ';
       } else {
        masterEl.placeholder += '...(' + results.length + ')';
       }
      } 
     }
    } else {
      // no results
      masterEl.placeholder = 'master';
    }
   }
   
   
  });

  
 }); // CLOSING FETCH

} // CLOSING WINDOW.ONLOAD