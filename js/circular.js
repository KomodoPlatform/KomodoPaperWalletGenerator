var randomBar = new ProgressBar.Circle('#random-bar', {
    color: '#D1D5D8',
    trailColor: '#54606E',
    duration: 500,
    easing: 'easeOut',
    strokeWidth: 5,
    fill: '#2F6565',
    // text: {
    //     value: '0%',
    //     className: 'randombar_finished'
    // }
});

var randomseeder = function(evt) {
    if (!evt) var evt = window.event;
    var timeStamp = new Date().getTime();

    if (ninja.seeder.seedCount == ninja.seeder.seedLimit) {

        document.removeEventListener('mousemove', randomseeder);
        document.removeEventListener('keypress', randomseeder);
        // document.removeEventListener('mousemove', arguments.callee, false);
        // document.removeEventListener('keypress', arguments.callee, false);

        ninja.seeder.seedCount++;
        // randomBar.setText('100%');
        // randomBar.text.className += ' randombar_finished';

        document.querySelector('#generatingseed').style.opacity = 0;
        document.querySelector('#generatingseed').style.visibility = 'hidden';

        setTimeout(function() {
            ninja.wallets.singlewallet.open();
            document.querySelector('#menu').style.visibility = 'visible';
            document.querySelector('#generatetext').style.display = 'none';
            document.querySelector('#generatedtext').style.display = 'block';
            document.querySelector('#generatedheader').style.display = 'block';
            document.querySelector('#generatingseed').style.display = 'none';
            document.querySelector('#random-innertext').innerHTML = '';
        }, 1000)
    } else if ((ninja.seeder.seedCount < ninja.seeder.seedLimit) && evt && (timeStamp - ninja.seeder.lastInputTime) > 40) {
        SecureRandom.seedTime();

        if (evt.type == 'keypress') {
            SecureRandom.seedInt8(evt.which);
            var keyPressTimeDiff = timeStamp - ninja.seeder.lastInputTime;
            SecureRandom.seedInt8(keyPressTimeDiff);
            var hex = (evt.which * keyPressTimeDiff).toString(16).substr(-2);
        } else { //mousemove
            SecureRandom.seedInt16((evt.clientX * evt.clientY));
            var hex = (evt.clientX * evt.clientY).toString(16).substr(-2);
        }
        ninja.seeder.seedCount++;
        ninja.seeder.lastInputTime = new Date().getTime();

        var progress = ninja.seeder.seedCount / ninja.seeder.seedLimit;
        var randomLeft = (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 77);
        var randomTop = (Math.round(Math.random()) * 2 - 1) * Math.floor(Math.random() * 77);

        randomBar.animate(progress);
        // randomBar.setText(Math.floor(progress * 100) + '%');

        var element = document.createElement("div");
        element.className = 'randombar_text';
        element.style.marginLeft = randomLeft + 'px';
        element.style.marginTop = randomTop + 'px';
        element.appendChild(document.createTextNode(hex));
        document.querySelector('#random-innertext').appendChild(element);
        element.style.opacity = 1;
        element.style.visibility = 'visible';

        setTimeout(function() {
            element.style.opacity = 0;
            element.style.visibility = 'hidden';
        }, 100)

        // console.log(Crypto.util.bytesToHex(SecureRandom.pool)); 
    }
}

document.querySelector('#newaddresshero').addEventListener('click', function() {
    document.querySelector('#generatedheader').style.display = 'none';
    document.querySelector('#generatingseed').style.display = 'block';
    document.addEventListener('mousemove', randomseeder, false);
    document.addEventListener('keypress', randomseeder, false); 
});
