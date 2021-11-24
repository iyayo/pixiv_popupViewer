window.onload = async () => {
    const searchClass = ["_one-click-bookmark", "js-click-trackable", "opener", "item"];
    const observer = new MutationObserver(setEventHandler);
    const target = document.body;
    const config = { childList: true, subtree: true };

    observer.observe(target, config);

    const iframe_container = document.createElement("div");
    iframe_container.id = "pixiv_popupViewer_container";

    const iframe = document.createElement("iframe");
    iframe.id = "pixiv_popupViewer";

    const switch_expand_button = document.createElement("div");
    switch_expand_button.id = "pixiv_popupViewer_switch_expand_button";
    switch_expand_button.innerHTML = '<svg aria-hidden="true" width="24px" height="24px" focusable="false" data-prefix="fas" data-icon="expand" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M0 180V56c0-13.3 10.7-24 24-24h124c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H64v84c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12zM288 44v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12V56c0-13.3-10.7-24-24-24H300c-6.6 0-12 5.4-12 12zm148 276h-40c-6.6 0-12 5.4-12 12v84h-84c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24V332c0-6.6-5.4-12-12-12zM160 468v-40c0-6.6-5.4-12-12-12H64v-84c0-6.6-5.4-12-12-12H12c-6.6 0-12 5.4-12 12v124c0 13.3 10.7 24 24 24h124c6.6 0 12-5.4 12-12z"></path></svg>';

    let options = await getStorageOptions();
    compressPopup(options.popupWidth, options.popupHeight);

    target.append(iframe_container);
    iframe_container.append(iframe, switch_expand_button);

    iframe_container.onclick = function () {
        if (!iframe_container.classList.contains("show")) return;

        iframe.src = "about:blank";
        iframe_container.classList.toggle("show");

        document.getElementsByTagName("html")[0].style.overflowY = "auto";
    }

    switch_expand_button.onclick = function (event) {
        event.stopPropagation();

        if (iframe.classList.contains("expand")) {
            switch_expand_button.innerHTML = '<svg aria-hidden="true" width="24px" height="24px" focusable="false" data-prefix="fas" data-icon="compress" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M436 192H312c-13.3 0-24-10.7-24-24V44c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v84h84c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm-276-24V44c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v84H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24zm0 300V344c0-13.3-10.7-24-24-24H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-84h84c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12H312c-13.3 0-24 10.7-24 24v124c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12z"></path></svg>';
            compressPopup(options.popupWidth, options.popupHeight);
        } else {
            switch_expand_button.innerHTML = '<svg aria-hidden="true" width="24px" height="24px" focusable="false" data-prefix="fas" data-icon="expand" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M0 180V56c0-13.3 10.7-24 24-24h124c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H64v84c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12zM288 44v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12V56c0-13.3-10.7-24-24-24H300c-6.6 0-12 5.4-12 12zm148 276h-40c-6.6 0-12 5.4-12 12v84h-84c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24V332c0-6.6-5.4-12-12-12zM160 468v-40c0-6.6-5.4-12-12-12H64v-84c0-6.6-5.4-12-12-12H12c-6.6 0-12 5.4-12 12v124c0 13.3 10.7 24 24 24h124c6.6 0 12-5.4 12-12z"></path></svg>';
            expandPopup();
        }
    }

    function setEventHandler() {
        let Atags = document.querySelectorAll('a[href^="/artworks/"], a[href^="/novel/show.php?"]');

        Atags.forEach(element => {
            element.onclick = function (event) {
                event.preventDefault();

                for (let i = 0; i < searchClass.length; i++) {
                    if (event.target.classList.contains(searchClass[i])) return;
                }

                iframe.src = event.currentTarget.href;
                iframe_container.classList.toggle("show");

                document.getElementsByTagName("html")[0].style.overflowY = "hidden";
            };
        });
    }

    function getStorageOptions() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(["popupWidth", "popupHeight"], items => resolve(items))
        })
    }

    function compressPopup(width, height) {
        iframe.classList.remove("expand");

        if (width === undefined || height === undefined) {
            iframe.style.width = "80%";
            iframe.style.height = "90%";
        } else {
            iframe.style.width = width + "%";
            iframe.style.height = height + "%";
        }
    }

    function expandPopup() {
        iframe.classList.add("expand");
        iframe.style.width = "100%";
        iframe.style.height = "100%";
    }

    chrome.storage.onChanged.addListener(items => {
        if (items.popupWidth) options.popupWidth = items.popupWidth.newValue;
        if (items.popupHeight) options.popupHeight = items.popupHeight.newValue;

        if (iframe.classList.contains("expand")) return;

        compressPopup(options.popupWidth, options.popupHeight);
    })
}