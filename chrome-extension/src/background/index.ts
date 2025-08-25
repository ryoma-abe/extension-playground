chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'a',
    title: '(A) 常に表示',
    contexts: ['all'],
  });
  chrome.contextMenus.create({
    id: 'b',
    title: '(B) 選択時のみ表示',
    contexts: ['selection'],
  });
});
