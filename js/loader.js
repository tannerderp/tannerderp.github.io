function loadScript(url, callback) {
    // Adding the script tag to the head as suggested before
    var body = document.querySelector("body");
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    body.appendChild(script);
};
function doneLoading(){
    $("#navbar").load("/htmltemplates/nav.html", function(){
        if(active){
            var $active = $('#' + active);
            $active.addClass("active");
            $active.children().append(' <span class="sr-only">(current)</span>');
        }
    });
};
loadScript("https://code.jquery.com/jquery-3.4.0.min.js", loadPopper);
function loadPopper(){
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js", loadBootstrap);
}
function loadBootstrap(){
    loadScript("https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js", doneLoading);
}
