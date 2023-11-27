document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get('currency', function(data) {
    if (data.currency) {
      document.getElementById('currency').value = data.currency;
    }
  });

  document.getElementById('save').addEventListener('click', function() {
    const currency = document.getElementById('currency').value;
    chrome.storage.sync.set({currency: currency}, function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.reload(tabs[0].id);
      });
    });
  });
});
