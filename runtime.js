chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.checkUpdate) {
        chrome.storage.local.get('lastVersion', (result) => {
            const currentVersion = chrome.runtime.getManifest().version;
            if (result.lastVersion !== currentVersion) {
                chrome.tabs.create({ url: chrome.runtime.getURL('update.html') });

                chrome.storage.local.set({ lastVersion: currentVersion });
            }
        });
    }
});
