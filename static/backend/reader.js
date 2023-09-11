document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        setTimeout(() => {
            window.reader = ePubReader(window.path, {
                restore: true
            });    
        }, 500);
    }
};