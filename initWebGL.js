function prependToBody(message) {
    document.body.innerHTML = `${message}<br>${document.body.innerHTML}`;

}

function initiWebGL() {
    const canvas = document.querySelector(`#testCanvas`);

    if (!canvas) {
        prependToBody("Couldn't find canvas element!");
        return;
    }

    const context = canvas.getContext('webgl');

    if (!context) {
        prependToBody("Couldn't create webgl context!");
        return;
    }

    prependToBody(context);
}

initiWebGL();