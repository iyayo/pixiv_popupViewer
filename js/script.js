window.onload = async () => {
    let aTags;
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
    switch_expand_button.title = "最大化";

    const previous_work_button = document.createElement("div");
    previous_work_button.id = "pixiv_popupViewer_previous_work_button";
    previous_work_button.innerHTML = '<svg aria-hidden="true" width="24px" height="24px" focusable="false" data-prefix="fas" data-icon="angle-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path fill="white" d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"></path></svg>';
    previous_work_button.title = "前の作品";

    const next_work_button = document.createElement("div");
    next_work_button.id = "pixiv_popupViewer_next_work_button";
    next_work_button.innerHTML = '<svg aria-hidden="true" width="24px" height="24px" focusable="false" data-prefix="fas" data-icon="angle-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path fill="white" d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path></svg>';
    next_work_button.title = "次の作品";

    let options = await getStorageOptions();
    compressPopup(options.popupWidth, options.popupHeight);

    target.append(iframe_container);
    iframe_container.append(iframe, switch_expand_button, previous_work_button, next_work_button);

    iframe_container.onclick = function () {
        if (!iframe_container.classList.contains("show")) return;

        iframe.contentWindow.location.replace("about:blank");
        iframe_container.classList.toggle("show");

        document.getElementsByTagName("html")[0].style.overflowY = "auto";
        observer.observe(target, config);
    }

    switch_expand_button.onclick = function (event) {
        event.stopPropagation();

        if (iframe.classList.contains("expand")) {
            switch_expand_button.innerHTML = '<svg aria-hidden="true" width="24px" height="24px" focusable="false" data-prefix="fas" data-icon="expand" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M0 180V56c0-13.3 10.7-24 24-24h124c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H64v84c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12zM288 44v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12V56c0-13.3-10.7-24-24-24H300c-6.6 0-12 5.4-12 12zm148 276h-40c-6.6 0-12 5.4-12 12v84h-84c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24V332c0-6.6-5.4-12-12-12zM160 468v-40c0-6.6-5.4-12-12-12H64v-84c0-6.6-5.4-12-12-12H12c-6.6 0-12 5.4-12 12v124c0 13.3 10.7 24 24 24h124c6.6 0 12-5.4 12-12z"></path></svg>';
            compressPopup(options.popupWidth, options.popupHeight);
            switch_expand_button.title = "最大化";
        } else {
            switch_expand_button.innerHTML = '<svg aria-hidden="true" width="24px" height="24px" focusable="false" data-prefix="fas" data-icon="compress" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M436 192H312c-13.3 0-24-10.7-24-24V44c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v84h84c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12zm-276-24V44c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v84H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24zm0 300V344c0-13.3-10.7-24-24-24H12c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0v-84h84c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12H312c-13.3 0-24 10.7-24 24v124c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12z"></path></svg>';
            expandPopup();
            switch_expand_button.title = "縮小";
        }
    }

    previous_work_button.onclick = function (event) {
        event.stopPropagation();

        const currentIndex = Number(iframe.dataset.currentIndex);

        for (let i = currentIndex; 0 < i; i--) {
            const aTag = aTags[i];

            if (!aTag || aTag.href === aTags[currentIndex].href) continue;

            if (aTag.href === aTags[0].href) previous_work_button.style.visibility = "hidden";
            else previous_work_button.style.visibility = "visible";

            next_work_button.style.visibility = "visible";

            iframe.contentWindow.location.replace(aTag.href);
            iframe.dataset.currentIndex = i;
            
            return;
        }
    }

    next_work_button.onclick = function (event) {
        event.stopPropagation();

        const currentIndex = Number(iframe.dataset.currentIndex);

        for (let i = currentIndex; i < aTags.length; i++) {
            const aTag = aTags[i];

            if (!aTag || aTag.href === aTags[currentIndex].href) continue;

            if (aTag.href === aTags[aTags.length - 1].href) next_work_button.style.visibility = "hidden";
            else next_work_button.style.visibility = "visible";

            previous_work_button.style.visibility = "visible";

            iframe.contentWindow.location.replace(aTag.href);
            iframe.dataset.currentIndex = i;
            
            return;
        }
    }

    function setEventHandler() {
        aTags = Array.from(document.querySelectorAll('a[href^="/artworks/"], a[href^="/novel/show.php?"]'));

        aTags.forEach(element => {
            element.onclick = function (event) {
                event.preventDefault();

                for (let i = 0; i < searchClass.length; i++) {
                    if (event.target.classList.contains(searchClass[i])) return;
                }

                observer.disconnect();

                if (event.currentTarget.href === aTags[0].href) previous_work_button.style.visibility = "hidden";
                else previous_work_button.style.visibility = "visible";

                if (event.currentTarget.href === aTags[aTags.length - 1].href) next_work_button.style.visibility = "hidden";
                else next_work_button.style.visibility = "visible";

                iframe.dataset.currentIndex = aTags.findIndex(aTag => aTag === event.currentTarget);
                iframe.contentWindow.location.replace(event.currentTarget.href);
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