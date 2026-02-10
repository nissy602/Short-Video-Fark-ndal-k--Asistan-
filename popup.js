const select = document.getElementById('limitSecici');


for (let i = 5; i <= 60; i += 5) {
  const opt = document.createElement('option');
  opt.value = i * 60; 
  opt.innerText = i + " Dakika"; 
  select.appendChild(opt);
}


const testOpt = document.createElement('option');
testOpt.value = 10;
testOpt.innerText = "10 Saniye (Test Modu)";
select.prepend(testOpt); 

chrome.storage.local.get(['kullaniciLimiti'], (result) => {
  if (result.kullaniciLimiti) {
    select.value = result.kullaniciLimiti;
  }
});


select.addEventListener('change', () => {
  const yeniLimit = select.value;
  chrome.storage.local.set({ kullaniciLimiti: yeniLimit });
});